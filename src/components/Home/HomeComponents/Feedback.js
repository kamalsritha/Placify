import React from "react";

const Feedback = () => {
  return (
    <div
      style={{
        backgroundColor: "#f4f5f7",
        padding: "50px 20px",
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          marginBottom: "40px",
        }}
      >
        <p
          style={{
            color: "#2c3e50",
            fontSize: "24px",
            fontWeight: "600",
            textTransform: "uppercase",
            margin: "0",
          }}
        >
          Placify Feedback
        </p>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#34495e",
            margin: "10px 0",
          }}
        >
          What Students and Recruiters Are Saying
        </h1>
      </div>

      {/* Content Section */}
      <div
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          padding: "30px",
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#34495e",
            marginBottom: "15px",
          }}
        >
          Empowering Placement Success
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#7f8c8d",
            lineHeight: "1.8",
            marginBottom: "20px",
          }}
        >
          Placify is dedicated to simplifying the placement process for students
          and recruiters alike. Our platform bridges the gap between talent and
          opportunity by providing real-time updates, seamless scheduling, and
          valuable insights. Whether you’re a student looking to land your dream
          job or a recruiter seeking top-notch candidates, Placify ensures a
          smooth and efficient experience.
        </p>

        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#34495e",
            marginBottom: "15px",
          }}
        >
          Why Choose Placify?
        </h2>
        <ul
          style={{
            listStyle: "none",
            padding: "0",
            color: "#7f8c8d",
            lineHeight: "1.8",
            fontSize: "16px",
          }}
        >
          <li>
            <strong>Comprehensive Features:</strong> Stay updated with company
            listings, interview schedules, and placement insights.
          </li>
          <li>
            <strong>User-Friendly Interface:</strong> Navigate effortlessly
            through all features and find what you need in just a few clicks.
          </li>
          <li>
            <strong>Customizable Alerts:</strong> Never miss an opportunity with
            real-time notifications tailored to your preferences.
          </li>
          <li>
            <strong>Secure Platform:</strong> Trust your data with our
            robust security and privacy measures.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Feedback;