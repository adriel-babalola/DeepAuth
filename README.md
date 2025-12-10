## DeepAuth v2.1.0: Simple README 🤖📰

DeepAuth is an **AI-powered tool** that checks if a claim (a piece of information) is true or false in **real-time**.

It uses Google's latest **Gemini 2.0 Flash AI** and connects it directly to **Google Search** to get the most accurate, up-to-date answers.


-----

### ⭐ What it Does

  * **Checks Claims Fast:** Gives you a verdict (SUPPORTED, CONTRADICTED, etc.) and a **Confidence Score** (e.g., 87%).
  * **Uses Real Internet Data:** The AI searches the web live to verify the information.
  * **Safe and Fast:** Includes a **Rate Limiter** (10 requests per minute) for protection.
  * **Looks Great:** Has a **modern, mobile-friendly design** using Tailwind CSS.
  * **Clear Results:** Shows you the final **Verdict, Reasoning, and the Articles** the AI used.

-----

### 💻 How to Run It

DeepAuth has two main parts: the **Backend** (Node.js/Express) and the **Frontend** (React/Vite).

1.  **Get the Code:**
    ```bash
    git clone https://github.com/adriel-babalola/DeepAuth.git
    cd DeepAuth
    ```
2.  **Install Everything:**
    ```bash
    npm install
    ```
3.  **Get Your Keys:** You need a **Google Gemini API Key** and a **Upstash Redis Key**.
4.  **Start Dev Mode:** (This runs both the front-end and the back-end)
    ```bash
    npm run dev
    ```

You can then visit the app in your browser at **http://localhost:5173**.

-----

### 🧠 Core Technology

| Part | Tech Used |
| :--- | :--- |
| **AI Brain** | Gemini 2.0 Flash Experimental (with Google Search) |
| **Server** | Node.js (Express) |
| **Website** | React + Vite |
| **Style/Look** | Tailwind CSS 4.1 |
| **Security** | Upstash Redis (for Rate Limiting) |

-----

### 📌 API Endpoint

The main function happens here:

  * **POST** `/api/verify`: Send a claim, get a verdict, confidence score, and articles back.

-----

### 📝 Project Structure

The code is split into two main folders:

  * `backendv2/`: The server code (Express, Gemini API logic, Rate Limiter).
  * `client/`: The website code (React components, UI).

-----

### 👋 Connect

  * **Author:** Adriel Babalola
  * **License:** ISC

**Status:** ✅ **Production Ready** | **Version:** 2.1.0
