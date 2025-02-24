### **Full-Stack Developer Task**

**Objective:** Develop a dummy full-stack application with authentication, real-time data visualization, and CRUD operations. The task evaluates your technical skills, adherence to best practices, and ability to deliver a functional product. **Please read the submission instructions at the end of this document.**

**NOTE:** feel free to use any AI based tools to assist you in this task. However, we expect you to have a thorough understanding of what you have submitted.

---

### **Backend: Python (FastAPI)**

#### **Core Requirements**

1. **Authentication**  
   * Implement basic authentication:  
     * Accept any username and password.  
     * Issue session tokens (e.g., JWT or UUID-based).  
   * Validate session tokens for protected endpoints.  
2. **Random Number Generator**  
   * Generate random numbers every second.  
   * Store the numbers in a database (SQLite or Redis) as key-value pairs:  
     * **Key:** Current timestamp.  
     * **Value:** Random number.

#### **API Endpoints**

1. **Login Endpoint:** Issue tokens for authentication.  
2. **Real-Time Data Streaming:** Provide a WebSocket or REST endpoint to stream random numbers (requires authentication).  
3. **CSV File Fetch:** Fetch the provided `backend_table.csv` (requires authentication).  
4. **CRUD Operations:** Allow users to perform Create, Read, Update, and Delete (CRUD) operations on `backend_table.csv`:  
   * Persist changes to the file.  
   * Return errors for invalid operations.  
5. **Concurrency Management:**  
   * Implement a **file locking mechanism** to handle simultaneous CRUD operations by multiple users.  
6. **Recovery Mechanism:**  
   * Before overwriting `backend_table.csv`, create a backup of the previous version for recovery.

#### **Database**

* Store:  
  * User sessions (username and token).  
  * Generated random numbers (timestamp and value).

#### **Hosting**

* Deploy the backend on a free platform like **Render**, **Railway**, or **Deta**.

---

### **Frontend: React or Vue**

#### **Core Requirements**

1. **Authentication**  
   * Create a login page for username and password input.  
   * Store the session token using a state management library (e.g., Redux/Zustand for React, Vuex/Pinia for Vue).  
   * Restrict access to application pages for unauthenticated users.  
2. **Main Application**  
   * Use a **dark theme** UI.  
   * Include the following components:  
     * **Interactive Plot:** Display real-time streamed random numbers using a library like Chart.js or D3.js.  
     * **Dynamic Table:** Show stored numbers and records in a **paginated, sortable table**.  
     * **CRUD Interface:** Allow users to perform CRUD operations on `backend_table.csv`.

#### **Features**

1. **Dynamic Updates:**  
   * Real-time data streaming updates the plot and table dynamically.  
2. **Error Handling:**  
   * Display errors for failed logins, unauthorized actions, or conflicting CRUD operations.  
3. **Session Persistence:**  
   * Use **localStorage** or **sessionStorage** to maintain the user session.

#### **Concurrency Handling**

* Inform users of conflicting or pending operations during simultaneous CRUD actions.

#### **Recovery UI**

* Provide an option to restore data from the most recent backup file.

#### **Hosting**

* Deploy the frontend on a free platform like **Vercel** or **Netlify**.

---

### **Task Requirements**

* **Tech Stack:** Use **FastAPI** for the backend and **React** or **Vue** for the frontend.  
* **Deployment:** Host both frontend and backend on free cloud platforms. Provide working links.  
* **Documentation:** Include clear setup and usage instructions in a `README.md`.

---

### **Evaluation Criteria**

#### **Functionality**

* Authentication and access control are correctly implemented.  
* Real-time data visualization works as required.  
* CRUD operations update the backend and UI seamlessly.

#### **Code Quality**

* Clean, modular, and maintainable code.  
* Follows industry standards for authentication and concurrency handling.

#### **UI/UX**

* User-friendly login flow.  
* Consistent dark theme and smooth state transitions.

#### **Deployment**

* Fully functional and accessible frontend and backend with provided links.

#### **Documentation**

* Clear `README.md` explaining:  
  * Local setup instructions.  
  * Testing steps for authentication, data visualization, and CRUD features.  
  * Links to the hosted backend and frontend.

---

### **Deliverables**

URL to hosted frontend.

---

### **Submission Instructions**

Write a mail to [careers@blackrose.com](mailto:careers@blackrose.com) with the subject **“APPLY: Full-Stack Developer (F6991)”** and the body containing the following:

* URL to hosted frontend  
* Your CV/Resume  
* Answers to the following questions:  
  * Are you looking to work full-time or part-time?  
  * Are you based in Gurgaon? If not, are you willing to relocate?  
  * What is your expected salary/compensation?

