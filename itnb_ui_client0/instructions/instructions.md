# Project Requirements Document (PRD)

## 1. Objective

Create a unified UI for a Retrieval-Augmented Generation (RAG) software that enables:

1. Secure Single Sign-On (SSO)
2. Chat Interface for RAG queries
3. Document Upload for processing
4. Analytics Dashboard for usage insights

The UI should be intuitive, secure, and scalable for internal company use.

## 2. Scope

The system will cater to employees and stakeholders, featuring:

- SSO to leverage corporate authentication
- A real-time Chat for RAG interactions
- Document Upload with progress reporting
- An Analytics Dashboard for admin insights

By centralizing these capabilities, the software aims to improve user productivity and ensure secure document handling.

## 3. Key Features and Requirements

### 3.1. Login (SSO)

**Purpose:** Provide a secure, company-standard login without extra credentials.

**Requirements:**
- Single Sign-On (SSO) (OAuth2, SAML, or OpenID Connect)
- Role-based access control for Admin, User, etc.

**Success Criteria:**
- Users must sign in with company credentials
- Non-authorized users should see restricted or no features

> **Reference:** [NextAuth.js](https://next-auth.js.org/) or [Auth0](https://auth0.com/docs)

*Example SSO Setup (pseudocode):*

```typescript
// app/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import SomeProvider from "next-auth/providers/some-idp";

export default NextAuth({
  providers: [
    SomeProvider({
      clientId: process.env.IDP_CLIENT_ID!,
      clientSecret: process.env.IDP_CLIENT_SECRET!
    })
  ],
  callbacks: {
    // e.g., attach roles, handle session
  }
});
```

### 3.2. Chat Interface

**Purpose:** Allow users to query the RAG system in a conversational format.

**Requirements:**
- Real-time messaging or near real-time updates
- Typing suggestions / auto-complete if feasible
- Persistent or session-based chat history

**Success Criteria:**
- Responses returned within 1–3 seconds
- Users can quickly refine queries based on RAG feedback

*Conceptual Chat Hook:*

```typescript
function useChat() {
  const [messages, setMessages] = useState([]);
  const sendMessage = (text: string) => {
    // call RAG endpoint, update state
  };
  return { messages, sendMessage };
}
```

### 3.3. Document Upload

**Purpose:** Enable users to provide additional documents for RAG ingestion.

**Requirements:**
- Drag-and-drop & file selection
- Support multiple file types (PDF, DOCX, TXT)
- File size limit & progress indicators

**Success Criteria:**
- Secure storage, comply with data standards (GDPR, HIPAA if applicable)
- Error handling for unsupported or oversized files

> **Reference:** [react-dropzone](https://react-dropzone.js.org/) or basic `<input>` approach

*Example (react-dropzone) Snippet:*

```javascript
// usage in a component
<Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
  {({getRootProps, getInputProps}) => (
    <section {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag & drop some files here, or click to select files</p>
    </section>
  )}
</Dropzone>
```

### 3.4. Analytics Dashboard

**Purpose:** Provide real-time or near real-time insights on usage.

**Requirements:**
- Visual representations: charts, graphs, or tables
- Key metrics (logins, uploaded file counts, response times, user engagement)
- Export options (CSV, Excel, PDF)

**Success Criteria:**
- Admins can easily view usage trends and export data
- Must handle multiple date ranges and refresh intervals

> **Reference:** [react-chartjs-2](https://react-chartjs-2.js.org/)

*Example Chart Snippet:*

```typescript
import { Bar } from 'react-chartjs-2';

const MyChart = () => (
  <Bar 
    data={{ labels: ["Mon","Tue"], datasets: [{ label: "Logins", data: [30, 45] }] }}
  />
);
```
