const form = document.getElementById("studentLoginForm");
const message = document.getElementById("message");
const resultSection = document.getElementById("resultSection");
const tableBody = document.getElementById("resultTableBody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.style.color = "black";
  message.textContent = "Checking student...";

  const studentCode = document.getElementById("studentCode").value.trim();

  // STEP 1: Get student using ONLY student_code
  const { data: student, error: studentError } = await supabaseClient
    .from("Student")
    .select("*")
    .eq("student_code", studentCode)
    .single();

  if (studentError) {
    message.style.color = "red";
    message.textContent = "Student fetch error: " + studentError.message;
    return;
  }

  if (!student) {
    message.style.color = "red";
    message.textContent = "Student not found.";
    return;
  }

  message.textContent = "Student found. Fetching results...";

  // STEP 2: Get results
  const { data: results, error: resultError } = await supabaseClient
    .from("Results")
    .select("*")
    .eq("student_id", student.id);

  if (resultError) {
    message.style.color = "red";
    message.textContent = "Result fetch error: " + resultError.message;
    return;
  }

  if (!results || results.length === 0) {
    message.style.color = "orange";
    message.textContent = "No results found for this student.";
    return;
  }

  // STEP 3: Display results
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

  resultSection.style.display = "block";
  message.style.color = "green";
  message.textContent = "Results loaded successfully!";
});
  const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", () => {
  const element = document.getElementById("resultSection");

  html2pdf().from(element).save("Student_Result.pdf");
});