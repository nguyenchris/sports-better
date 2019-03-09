// Helper function to determine 3 hours from today's time

const dt = new Date();
dt.setHours(dt.getHours() + 2.75);
console.log(dt);
module.exports = dt;
