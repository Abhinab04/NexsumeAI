const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const mockResume = {
    personalInfo: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "555-0199",
        linkedin: "https://linkedin.com/in/janedoe",
        github: "https://github.com/janedoe",
        portfolio: null
    },
    summary: "Experienced software engineer with a passion for scalable web applications.",
    experience: [
        {
            company: "Tech Corp",
            role: "Senior Developer",
            startDate: "Jan 2020",
            endDate: "Present",
            location: "New York, NY",
            description: ["Led a team of 5 engineers.", "Reduced load times by 40%."]
        }
    ],
    education: [
        {
            institution: "State University",
            degree: "B.S. Computer Science",
            startDate: "2015",
            endDate: "2019",
            location: "Boston, MA",
            gpa: "3.8"
        }
    ],
    skills: {
        languages: ["JavaScript", "TypeScript", "Python"],
        frameworks: ["React", "Express", "Node.js"],
        tools: ["Git", "Docker", "AWS"]
    },
    projects: [
        {
            name: "Portfolio Website",
            technologies: ["React", "Tailwind CSS"],
            link: "https://janedoe.com",
            description: ["Built a responsive personal portfolio.", "Implemented dark mode."]
        }
    ]
};

async function run() {
    try {
        const templatePath = path.join(__dirname, 'templates', 'template4.ejs');
        console.log("Template path:", templatePath);
        
        const latexString = await ejs.renderFile(templatePath, mockResume);
        console.log("Rendered LaTeX successfully. Length:", latexString.length);
        
        const encodedLatex = encodeURIComponent(latexString);
        const url = `https://latexonline.cc/compile?text=${encodedLatex}`;
        
        console.log("Sending GET request to latexonline.cc...");
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Compile Error:", errText);
            return;
        }
        
        console.log("Success! Compiled PDF.");
    } catch(err) {
        console.error(err);
    }
}
run();
