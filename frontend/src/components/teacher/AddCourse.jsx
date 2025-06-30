import { useState } from "react";
import AxiosInstance from "../../services/AxiosInstance";

function AddCourse() {
  const [course, setCourse] = useState({
    userID: "", // Will be filled before sending
    C_educator: "",
    C_categories: "",
    C_title: "",
    C_description: "",
    sections: [],
    C_price: 0,
  });

  const [sectionInput, setSectionInput] = useState("");

  const handleAddSection = () => {
    if (sectionInput.trim() !== "") {
      setCourse({ ...course, sections: [...course.sections, sectionInput] });
      setSectionInput("");
    }
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    try {
      const res = await AxiosInstance.post(
        "/api/courses/create",
        {
          ...course,
          userID: user?.id || user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Course added successfully");

      // Reset form
      setCourse({
        userID: "",
        C_educator: "",
        C_categories: "",
        C_title: "",
        C_description: "",
        sections: [],
        C_price: 0,
      });
    } catch (err) {
      console.error("Course creation error:", err);
      alert(err.response?.data?.error || "❌ Course creation failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add Course</h2>

      <input
        placeholder="Educator Name"
        value={course.C_educator}
        onChange={(e) => setCourse({ ...course, C_educator: e.target.value })}
      />
      <br />
      <br />

      <input
        placeholder="Category"
        value={course.C_categories}
        onChange={(e) =>
          setCourse({ ...course, C_categories: e.target.value })
        }
      />
      <br />
      <br />

      <input
        placeholder="Title"
        value={course.C_title}
        onChange={(e) => setCourse({ ...course, C_title: e.target.value })}
      />
      <br />
      <br />

      <textarea
        placeholder="Description"
        value={course.C_description}
        onChange={(e) =>
          setCourse({ ...course, C_description: e.target.value })
        }
      />
      <br />
      <br />

      <input
        placeholder="Price (0 for free)"
        type="number"
        value={course.C_price}
        onChange={(e) =>
          setCourse({ ...course, C_price: Number(e.target.value) })
        }
      />
      <br />
      <br />

      <input
        placeholder="Add Section"
        value={sectionInput}
        onChange={(e) => setSectionInput(e.target.value)}
      />
      <button onClick={handleAddSection}>Add Section</button>

      <ul>
        {course.sections.map((sec, i) => (
          <li key={i}>{sec}</li>
        ))}
      </ul>

      <br />
      <button onClick={handleSubmit}>Submit Course</button>
    </div>
  );
}

export default AddCourse;
