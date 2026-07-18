const data = {
    age: 25,
    weight: 80,
    goal: "muscle-gain",
    dietClass: "non_veg",
    activityRank: "intermediate",
    bodyConstraints: ["knee"]
};

fetch('http://localhost:5000/api/generate-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
