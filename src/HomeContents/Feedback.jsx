import React, { useState } from "react";
import "./style/Feedback.css";
import { API_CONFIG, getAuthHeaders, getJsonHeaders } from "../config/api";

const Feedback = () => {
	const [rating, setRating] = useState(0);
	const [hover, setHover] = useState(0);
	const [comment, setComment] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!rating) {
			setMessage("Please select a rating.");
			return;
		}
		setSubmitting(true);
		setMessage("");

		try {
			// Try with auth headers if token exists; else fall back to public headers
			const headers = getAuthHeaders
				? getJsonHeaders()
				: { "Content-Type": "application/json" };

			const res = await fetch(`${API_CONFIG.BASE_URL}/feedback`, {
				method: "POST",
				headers,
				body: JSON.stringify({ rating, comment }),
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(
					err.message || `Failed to submit feedback (${res.status})`
				);
			}

			setMessage("Thank you for your feedback!");
			setRating(0);
			setHover(0);
			setComment("");
		} catch (err) {
			setMessage(err.message || "Failed to submit feedback.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="feedback-container" id="feedback">
			<h2>Feedback</h2>

			<p className="headline">
				Your feedback = our secret ingredient for improvement!
			</p>
			<p className="subtext">
				Better experiences coming right up—
				<br />
				because you deserve the best!
			</p>
			<p className="subtext">
				Got a sec? Share your thoughts—
				<br />
				we’re all ears (and taste buds)!
			</p>

			<div className="stars">
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						className={star <= (hover || rating) ? "on" : "off"}
						onClick={() => setRating(star)}
						onMouseEnter={() => setHover(star)}
						onMouseLeave={() => setHover(0)}
					>
						★
					</span>
				))}
			</div>

			<textarea
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder="Help us spice things up—what can we do better?"
			></textarea>

			<button onClick={handleSubmit} disabled={submitting}>
				{submitting ? "Submitting..." : "Submit My Feedback"}
			</button>

			{message && (
				<div
					style={{
						marginTop: 10,
						color: message.startsWith("Thank") ? "green" : "red",
					}}
				>
					{message}
				</div>
			)}
		</div>
	);
};

export default Feedback;
