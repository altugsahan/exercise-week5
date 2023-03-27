const express = require('express');
const weightsRouter = require('./weights');
const { sequelize, Workout, Exercise } = require('./models');
const app = express();

app.use(express.json()); // enable parsing of JSON request bodies
app.use('/weights', weightsRouter); // use weightsRouter for requests to /weights

const port = 1234;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/:exercise', (req, res) => {
  const exercise = req.params.exercise;
  res.render(exercise);
});

app.get('/script.js', function(req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/public/script.js');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



async function createWorkout() {
  const workout = await Workout.create({ date: new Date() });

  await Exercise.create({
    sets: 3,
    reps: 10,
    weight: 50,
    workoutId: workout.id
  });
}

async function getWorkouts() {
  const workouts = await Workout.findAll({
    include: Exercise
  });

  console.log(JSON.stringify(workouts, null, 2));
}

(async () => {
  await sequelize.sync();

  await createWorkout();
  await getWorkouts();

  process.exit();
})();
