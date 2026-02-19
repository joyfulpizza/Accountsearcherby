const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/*
Search Roblox username → get userId
*/
app.get("/api/search/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const userLookup = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });

    const userData = await userLookup.json();

    if (!userData.data || userData.data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userData.data[0];

    // Get avatar
    const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${user.id}&size=420x420&format=Png&isCircular=false`);
    const avatarData = await avatarRes.json();

    // Get friends count
    const friendsRes = await fetch(`https://friends.roblox.com/v1/users/${user.id}/friends/count`);
    const friendsData = await friendsRes.json();

    res.json({
      username: user.name,
      displayName: user.displayName,
      userId: user.id,
      avatar: avatarData.data[0].imageUrl,
      friends: friendsData.count
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
