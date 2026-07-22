const fetch = require('node-fetch'); // need to use a request or dynamic import if node-fetch is not available, better use native http
const http = require('http');

const data = JSON.stringify({
  age: 25,
  weight: 70,
  goal: "general fitness",
  dietClass: "balanced",
  activityRank: "beginner",
  workoutDays: 3,
  equipment: "full_gym",
  bodyConstraints: ["shoulder_right"],
  painIntensities: { "shoulder_right": 90 },
  country: "Italy"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/generate-plan',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let responseData = '';
  res.on('data', chunk => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log(responseData);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
