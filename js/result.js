const form = document.getElementById("studentLoginForm");
const message = document.getElementById("message");
const resultSection = document.getElementById("resultSection");
const tableBody = document.getElementById("resultTableBody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.textContent = "Checking details...";
  message.style.color = "black";

  const studentCode = document.getElementById("studentCode").value.trim();
  const fullName = document.getElementById("fullName").value.trim();

  // 1. Check student exists
  const { data: student, error } = await supabaseClient
    .from("Students")
    .select("*")
    .eq("student_code", studentCode)
    .eq("full_name", fullName)
    .single();

  if (error || !student) {
    message.textContent = "Invalid student details.";
    message.style.color = "red";
    return;
  }

  // 2. Fetch results
  const { data: results, error: resultError } = await supabaseClient
    .from("Results")
    .select("subject, score, grade, term")
    .eq("student_id", student.id);

  if (resultError || results.length === 0) {
    message.textContent = "No results found.";
    message.style.color = "orange";
    return;
  }

  // 3. Display results
  tableBody.innerHTML = "";
  results.forEach((r) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.subject}</td>
      <td>${r.score}</td>
      <td>${r.grade}</td>
      <td>${r.term}</td>
    `;
    tableBody.appendChild(row);
  });

  message.textContent = "Result loaded successfully.";
  message.style.color = "green";
  resultSection.style.display = "block";
});
