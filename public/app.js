async function searchPlayer() {
  const username = document.getElementById("username").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "Searching...";

  try {
    const res = await fetch(`/api/search/${username}`);
    const data = await res.json();

    if (data.error) {
      resultDiv.innerHTML = "User not found.";
      return;
    }

    resultDiv.innerHTML = `
      <img src="${data.avatar}" width="150"><br>
      <h2>${data.displayName}</h2>
      <p>@${data.username}</p>
      <p>User ID: ${data.userId}</p>
      <p>Friends: ${data.friends}</p>
    `;

  } catch {
    resultDiv.innerHTML = "Error searching.";
  }
}
