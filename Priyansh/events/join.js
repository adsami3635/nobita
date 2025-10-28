module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "Priyansh",
  description: "Welcome new members with custom message"
};

module.exports.run = async function({ api, event }) {
  try {
    const { threadID } = event;

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
      await api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "Bot" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
      return api.sendMessage(`Connected successfully! Type ${global.config.PREFIX}help to see available commands.`, threadID);
    }

    const threadData = await api.getThreadInfo(threadID);
    const mentions = [];
    let msg = `Welcome to ${threadData.threadName}\n`;

    for (const { userFbId } of event.logMessageData.addedParticipants) {
      const userName = event.logMessageData.addedParticipants.find(p => p.userFbId === userFbId)?.fullName || "New member";
      mentions.push({ tag: userName, id: userFbId });
      msg += `→ ${userName}\n`;
    }

    msg += "\nWelcome to the group! 🎉";

    return api.sendMessage({
      body: msg,
      mentions
    }, threadID);
  } catch (error) {
    console.error("Join event error:", error);
    return api.sendMessage("An error occurred while processing new members.", event.threadID);
  }
};
