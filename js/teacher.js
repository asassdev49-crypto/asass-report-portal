let loggedInTeacher = null;

const loginForm = document.getElementById("teacherLoginForm");
const loginMessage = document.getElementById("loginMessage");
const loginSection = document.getElementById("loginSection");
const uploadSection = document.getElementById("uploadSection");

const uploadForm = document.getElementById("uploadForm");
const uploadMessage = document.getElementById("uploadMessage");

// Grade calculator
function calculateGrade(score) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

// TEACHER LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginMessage.textContent = "Verifying...";
  loginMessage.style.color = "black";

  const teacherCode = document.getElementById("teacherCode").value.trim();
  const teacherName = document.getElementById("teacherName").value.trim();

  const { data: teacher, error } = await supabaseClient
    .from("Teachers")
    .select("*")
    .eq("teacher_code", teacherCode)
    .eq("full_name", teacherName)
    .single();

  if (error || !teacher) {
    loginMessage.textContent = "Invalid teacher details.";
    loginMessage.style.color = "red";
    return;
  }

  loggedInTeacher = teacher;
  loginMessage.textContent = "Login successful.";
  loginMessage.style.color = "green";

  loginSection.style.display = "none";
  uploadSection.style.display = "block";
});

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

  // Find student
  const { data: student, error: studentError } = await supabaseClient
    .from("Students")
    .select("id")
    .eq("student_code", studentCode)
    .single();

  if (studentError || !student) {
    uploadMessage.textContent = "Student not found.";
    uploadMessage.style.color = "red";
    return;
  }

  // Insert result
  const { error: insertError } = await supabaseClient
    .from("Results")
    .insert({
      student_id: student.id,
      subject: subject,
      score: score,
      grade: grade,
      term: term,
      teacher_id: loggedInTeacher.id,
    });

  if (insertError) {
    uploadMessage.textContent = "Failed to upload result.";
    uploadMessage.style.color = "red";
    return;
  }

  uploadMessage.textContent = "Result uploaded successfully.";
  uploadMessage.style.color = "green";
  uploadForm.reset();
});
