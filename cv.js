function generateCV() {

    const name = document.getElementById("name").value;
    const jobTitle = document.getElementById("jobTitle").value;
    const email = document.getElementById("email").value;
    const skills = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;
  
   
    if (!name || !jobTitle || !email || !skills || !experience) {
      alert("Please fill in all fields before generating the CV.");
      return;
    }
  
  
    const button = document.querySelector("#cvForm button");
    button.innerText = "Generating...";
    button.disabled = true;

    try {

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
  
      doc.setFontSize(16);
      doc.text("Curriculum Vitae", 105, 20, null, null, "center");
  
      doc.setFontSize(12);
      doc.text(`Name: ${name}`, 20, 40);
      doc.text(`Job Title: ${jobTitle}`, 20, 50);
      doc.text(`Email: ${email}`, 20, 60);
      doc.text("Skills:", 20, 80);
      doc.text(skills.split(',').map(skill => `- ${skill.trim()}`).join('\n'), 30, 90);
      doc.text("Experience:", 20, 120);
      doc.text(experience, 30, 130, { maxWidth: 160 });
  

      doc.save(`${name}_CV.pdf`);
  
    } catch (error) {
      console.error("Error generating CV:", error);
      alert("There was an issue generating the CV. Please try again.");
    }
  

    button.innerText = "Generate and Download CV";
    button.disabled = false;
  }
  