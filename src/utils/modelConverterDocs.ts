const prismaToSwaggerType = (prismaType: string): { type: string; format?: string } => {
  const typeMap: Record<string, { type: string; format?: string }> = {
    String: { type: 'string' },
    Int: { type: 'integer', format: 'int32' },
    BigInt: { type: 'integer', format: 'int64' },
    Float: { type: 'number', format: 'float' },
    Decimal: { type: 'number', format: 'double' },
    Boolean: { type: 'boolean' },
    DateTime: { type: 'string', format: 'date-time' },
    Date: { type: 'string', format: 'date' },
    Json: { type: 'object' },
    Bytes: { type: 'string', format: 'byte' },
  };
  return typeMap[prismaType] || { type: 'string' };
};

const parseFieldAttributes = (attributes: string) => {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};

  if (attributes.includes('@id')) {
    result.description = 'Primary key identifier';
  }
  if (attributes.includes('@unique')) {
    result.description = (result.description || '') + ' Unique value';
  }
  if (attributes.includes('@default')) {
    const defaultMatch = attributes.match(/@default\((.*?)\)/);
    if (defaultMatch) {
      result.example = defaultMatch[1].replace(/['"]/g, '');
    }
  }
  if (attributes.includes('@updatedAt')) {
    result.description = 'Last updated timestamp';
  }
  if (attributes.includes('@createdAt')) {
    result.description = 'Creation timestamp';
  }

  return result;
};

export const parsePrismaSchema = (prismaSchema: string) => {
  const models: Record<string, any> = {};
  const enums: Record<string, string[]> = {};

  // First, extract and process enums
  const enumRegex = /enum\s+(\w+)\s*{([^}]+)}/g;
  let enumMatch;
  while ((enumMatch = enumRegex.exec(prismaSchema))) {
    const [, enumName, enumValues] = enumMatch;
    enums[enumName] = enumValues
      .split('\n')
      .map(v => v.trim())
      .filter(Boolean);
  }

  // Then process models
  const modelRegex = /model\s+(\w+)\s*{([^}]+)}/g;
  let modelMatch;

  while ((modelMatch = modelRegex.exec(prismaSchema))) {
    const [, modelName, modelContent] = modelMatch;
    const properties: Record<string, any> = {};
    const required: string[] = [];

    // Process each field in the model
    const fieldLines = modelContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'));

    fieldLines.forEach(line => {
      const fieldMatch = line.match(/^(\w+)\s+(\w+)(\?)?\s*(@.*)?$/);
      if (fieldMatch) {
        const [, fieldName, fieldType, optional, attributes = ''] = fieldMatch;

        // Start with basic type information
        let fieldSchema = {
          ...prismaToSwaggerType(fieldType),
          ...parseFieldAttributes(attributes)
        };

        // Handle enums
        if (enums[fieldType]) {
          fieldSchema = {
            type: 'string',
            enum: enums[fieldType],
            example: enums[fieldType][0]
          };
        }

        // Add field to properties
        properties[fieldName] = fieldSchema;

        // Add to required fields if not optional
        if (!optional) {
          required.push(fieldName);
        }
      }
    });

    // Create the model schema
    models[modelName] = {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined
    };
  }

  return models;
};