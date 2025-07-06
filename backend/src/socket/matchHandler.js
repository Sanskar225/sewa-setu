// socket/matchHandler.js
export function setupMatchingSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("request-service", async (data) => {
      const { userLat, userLon, category } = data;

      // Fetch providers in DB (or cache) matching category
      const providers = await getProvidersByCategory(category); // Add filtering logic

      providers.forEach((p) => {
        const dist = haversineDistance(userLat, userLon, p.latitude, p.longitude);
        if (dist <= 10) {
          io.to(p.userId).emit("service-request", {
            customer: socket.id,
            location: { lat: userLat, lon: userLon },
          });
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
}
