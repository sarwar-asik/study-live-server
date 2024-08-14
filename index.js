import express from "express";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const createToken = async () => {
  const roomName = "quickstart-room";
  const participantName = "quickstart-username";

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      ttl: "10m",
    }
  );
  at.addGrant({ roomJoin: true, room: roomName });

  return at.toJwt();
};

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get("/getToken", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    res.status(500).send({
      error: "Missing userId",
    });
  }
  try {
    const token = await createToken({ identity: userId });
    res.send(token);
  } catch (error) {
    res.status(500).send("Error creating token");
  }
});

const livekitHost = "https://my.livekit.host";
const roomService = new RoomServiceClient(
  livekitHost,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

// ! create a room
app.get("create-room", async (req, res) => {
  const roomName = req.body.roomName;
  roomService
    .createRoom({
      name: roomName,
      emptyTimeoutSS: 40 * 60,
      maxParticipants: 20,
    })
    .then((room) => {
      res.send(room);
    });
});

//! get participant of room
app.get("/get-participant", async (req, res) => {
  const roomName = req.query.roomName;
  if (!roomName) {
    res.status(500).send({
      error: "Missing roomName",
    });
  }
  roomService.getParticipants(roomName).then((participants) => {
    res.send(participants);
  });
});

// accept a participant into a room
app.get("/accept-participant", async (req, res) => {
  const roomName = req.query.roomName;
  if (!roomName) {
    res.status(500).send({
      error: "Missing roomName",
    });
  }
  const participantName = req.query.participantName;
  if (!participantName) {
    res.status(500).send({
      error: "Missing participantName",
    });
  }
  roomService
    .acceptParticipant(roomName, participantName)
    .then((participant) => {
      res.send(participant);
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
