import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "YOUR_URL";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1YWhkaWt3cWxjc3V5cmZyamVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDMzMjIsImV4cCI6MjA4NjExOTMyMn0.OnJtcrbG9O1TaEvqLnDnE1kIMZtqNUAy_AwFiPFrObg";

const supabase = createClient(supabaseUrl, supabaseKey);

let loggedInTeacher = null;

const loginForm = document.getElementById("teacherLoginForm");
const loginMessage = document.getElementById("loginMessage");
const loginSection = document.getElementById("loginSection");
const uploadSection = document.getElementById("uploadSection");
const uploadForm = document.getElementById("uploadForm");
const uploadMessage = document.getElementById("uploadMessage");
const logoutBtn = document.getElementById("logoutBtn");

// Grade calculator
function calculateGrade(score) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

// LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginMessage.textContent = "Logging in...";
  loginMessage.style.color = "black";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    loginMessage.textContent = "Invalid email or password.";
    loginMessage.style.color = "red";
    return;
  }

  const { data: teacher, error: teacherError } = await supabase
    .from("Teachers")
    .select("*")
    .eq("auth_id", data.user.id)
    .single();

  if (teacherError || !teacher) {
    loginMessage.textContent = "Teacher profile not found.";
    loginMessage.style.color = "red";
    return;
  }

  loggedInTeacher = teacher;

  loginSection.style.display = "none";
  uploadSection.style.display = "block";

  loginMessage.textContent = "Login successful.";
  loginMessage.style.color = "green";

  loadRecentResults();
});

// CHECK SESSION ON PAGE LOAD
async function checkSession() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    loginSection.style.display = "none";
    uploadSection.style.display = "block";
    loadRecentResults();
  }
}

checkSession();

// LOGOUT
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  location.reload();
});

// LOAD RECENT RESULTS
async function loadRecentResults() {
  const { data, error } = await supabase
    .from("Results")
    .select("*")
    .order("id", { ascending: false })
    .limit(5);

  const table = document.getElementById("recentResultsBody");
  table.innerHTML = "";

  if (data) {
    data.forEach((r) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.student_id}</td>
        <td>${r.subject}</td>
        <td>${r.score}</td>
        <td>${r.term}</td>
      `;
      table.appendChild(row);
    });
  }
}

// UPLOAD RESULT
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  uploadMessage.textContent = "Uploading...";
  uploadMessage.style.color = "black";

  const studentCode = document.getElementById("studentCode").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const score = parseInt(document.getElementById("score").value);
  const term = document.getElementById("term").value.trim();

  const grade = calculateGrade(score);

  const { data: student, error: studentError } = await supabase
    .from("Student")
    .select("id")
    .eq("student_code", studentCode)
    .single();

  if (studentError || !student) {
    uploadMessage.textContent = "Student not found.";
    uploadMessage.style.color = "red";
    return;
  }

  const { error: insertError } = await supabase
    .from("Results")
    .insert({
      student_id: student.id,
      subject,
      score,
      grade,
      term,
      teacher_id: loggedInTeacher.id,
    });

  if (insertError) {
    uploadMessage.textContent = "Upload failed.";
    uploadMessage.style.color = "red";
    return;
  }

  uploadMessage.textContent = "Result uploaded successfully.";
  uploadMessage.style.color = "green";

  uploadForm.reset();
  loadRecentResults();
});