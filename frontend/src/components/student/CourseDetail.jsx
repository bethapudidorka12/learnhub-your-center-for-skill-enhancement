import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../services/AxiosInstance";

function CourseDetail() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchCourse();
    fetchProgress();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await AxiosInstance.get(`/api/courses`);
      const found = res.data.find((c) => c._id === courseId);
      setCourse(found);
    } catch (err) {
      console.error("Course load error", err);
    }
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await AxiosInstance.get(`/api/courses/progress/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProgress(res.data.progress);
      setCompleted(res.data.completed);
    } catch (err) {
      console.error("Progress fetch error", err);
    }
  };

  const saveProgress = async (value) => {
    try {
      const token = localStorage.getItem("token");
      const newProgress = Math.min(progress + value, 100);
      const res = await AxiosInstance.put(
        `/api/courses/progress/${courseId}`,
        { progress: newProgress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProgress(res.data.data.progress);
      setCompleted(res.data.data.completed);
      alert("Progress saved ✅");
    } catch (err) {
      console.error("Save progress error", err);
    }
  };

  const downloadCertificate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await AxiosInstance.get(`/api/courses/certificate/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Required for binary download
      });

      // Create a blob link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificate.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Certificate download error", err);
      alert("Failed to download certificate");
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h3>{course.C_title}</h3>
      <p>{course.C_description}</p>
      <p>👨‍🏫 Educator: {course.C_educator}</p>
      <p>📂 Category: {course.C_categories}</p>
      <p>💰 {course.C_price === 0 ? "Free" : `₹${course.C_price}`}</p>
      <p>📈 Progress: {progress}%</p>
      <p>{completed ? "✅ Course Completed" : "🚀 In Progress"}</p>

      <button
        className="btn btn-success mt-3"
        onClick={() => saveProgress(25)}
        disabled={completed}
      >
        ▶️ Complete Next Section (+25%)
      </button>

      {completed && (
        <button
          className="btn btn-warning mt-3 ms-3"
          onClick={downloadCertificate}
        >
          🎓 Download Certificate
        </button>
      )}
    </div>
  );
}

export default CourseDetail;
