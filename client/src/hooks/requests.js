const API_URL = 'http://localhost:8000/api/v1';

// Load planets and return as JSON.
async function httpGetPlanets() {
  try {
    const response = await fetch(`${API_URL}/planets`);
    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
  }
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  try {
    const response = await fetch(`${API_URL}/launches`);
    const data = await response.json();

    data.sort((a, b) => a.flightNumber - b.flightNumber);

    return data;
  } catch (err) {
    console.error(err);
  }
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    console.error(err);
    return { ok: false };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.error(err);
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
