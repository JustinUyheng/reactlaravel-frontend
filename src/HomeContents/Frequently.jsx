import React from "react";
import "./style/Frequently.css";

const faqs = [
  {
    question: "What is USTP Food Corner?",
    answer:
      "USTP Food Corner is a platform that allows students to view food stalls and their available menu items within the USTP campus.",
  },
  {
    question: "Do I need to pay to access the menu?",
    answer:
      "Yes, access to the store listings and menu details requires a small fee of ₱19.00 per semester.",
  },
  {
    question: "How do I sign up for access?",
    answer:
      "You can sign up and pay the ₱19.00 fee through our platform to unlock full access to the menus and store details.",
  },
  {
    question: "Can I order food through USTP Food Corner?",
    answer:
      "No, USTP Food Corner does not facilitate ordering. It simply provides information on available food options.",
  },
  {
    question: "Can I search for specific meals on the platform?",
    answer:
      "Currently, the platform does not have a search function. Users must manually browse the menus to find available food items.",
  },
  {
    question: "What happens if my internet connection is slow or unstable?",
    answer:
      "Since the platform relies on an internet connection for real-time updates, a slow or unstable connection may affect its functionality. A stable internet connection is recommended for the best experience.",
  },
  {
    question: "Where can I find the food stalls listed?",
    answer:
      "All food stalls featured on USTP Food Corner are located within the USTP cafeteria.",
  },
];

const Frequently = () => {
  return (
    <div className="faq-container" id="faq">
      <h2>
        <span className="highlight">Frequently Asked Questions (FAQ)</span> &gt;
        USTP Food Corner
      </h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question">{faq.question}</div>
            <div className="faq-answer">• {faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frequently;