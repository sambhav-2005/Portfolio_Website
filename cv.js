// Email validation regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tab Handling
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Form Validation
function validateEmail(email) {
    return emailRegex.test(email);
}

function showError(inputElement, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    inputElement.classList.add('invalid');
    inputElement.classList.remove('valid');
    inputElement.parentElement.appendChild(errorDiv);
}

function removeError(inputElement) {
    const errorDiv = inputElement.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    inputElement.classList.remove('invalid');
    inputElement.classList.add('valid');
}

// Dynamic Form Entries
function addEducationEntry() {
    const template = document.querySelector('.education-entry').cloneNode(true);
    template.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelector('.education-entries').appendChild(template);
}

function addExperienceEntry() {
    const template = document.querySelector('.experience-entry').cloneNode(true);
    template.querySelectorAll('input, textarea').forEach(input => input.value = '');
    document.querySelector('.experience-entries').appendChild(template);
}

// Skills Handling
document.getElementById('skills').addEventListener('input', function(e) {
    const skillsContainer = document.getElementById('skillTags');
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    
    skillsContainer.innerHTML = skills.map(skill => `
        <div class="skill-tag">
            ${skill}
            <i class="fas fa-times" onclick="this.parentElement.remove()"></i>
        </div>
    `).join('');
});

// Preview Modal
const modal = document.getElementById('previewModal');
const closeBtn = document.querySelector('.close');

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function previewCV() {
    const name = document.getElementById('name').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    let educationHTML = '';
    document.querySelectorAll('.education-entry').forEach(entry => {
        const degree = entry.querySelector('[name="degree"]').value;
        const institution = entry.querySelector('[name="institution"]').value;
        const startDate = entry.querySelector('[name="eduStartDate"]').value;
        const endDate = entry.querySelector('[name="eduEndDate"]').value;
        
        if (degree && institution) {
            educationHTML += `
                <div class="education-item">
                    <h3>${degree}</h3>
                    <p>${institution}</p>
                    <p>${startDate} - ${endDate}</p>
                </div>
            `;
        }
    });
    
    let experienceHTML = '';
    document.querySelectorAll('.experience-entry').forEach(entry => {
        const position = entry.querySelector('[name="position"]').value;
        const company = entry.querySelector('[name="company"]').value;
        const startDate = entry.querySelector('[name="expStartDate"]').value;
        const endDate = entry.querySelector('[name="expEndDate"]').value;
        const description = entry.querySelector('[name="description"]').value;
        
        if (position && company) {
            experienceHTML += `
                <div class="experience-item">
                    <h3>${position}</h3>
                    <p>${company}</p>
                    <p>${startDate} - ${endDate}</p>
                    <p>${description}</p>
                </div>
            `;
        }
    });
    
    const skills = Array.from(document.querySelectorAll('.skill-tag'))
        .map(tag => tag.textContent.trim())
        .join(', ');
    
    const previewHTML = `
        <h1>${name}</h1>
        <p class="job-title">${jobTitle}</p>
        <p class="contact-info">
            <i class="fas fa-envelope"></i> ${email}
            ${phone ? `<br><i class="fas fa-phone"></i> ${phone}` : ''}
        </p>
        
        <section>
            <h2>Education</h2>
            ${educationHTML}
        </section>
        
        <section>
            <h2>Experience</h2>
            ${experienceHTML}
        </section>
        
        <section>
            <h2>Skills</h2>
            <p>${skills}</p>
        </section>
    `;
    
    document.getElementById('cvPreview').innerHTML = previewHTML;
    modal.style.display = "block";
}

function generateCV() {
    // Validate all fields
    let isValid = true;
    const requiredFields = ['name', 'jobTitle', 'email'];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            showError(input, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            isValid = false;
        }
    });
    
    if (!isValid) return;
    
    const email = document.getElementById('email').value.trim();
    if (!validateEmail(email)) {
        showError(document.getElementById('email'), 'Please enter a valid email address');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Get all form data
        const formData = {
            name: document.getElementById('name').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: email,
            phone: document.getElementById('phone').value,
            education: Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
                degree: entry.querySelector('[name="degree"]').value,
                institution: entry.querySelector('[name="institution"]').value,
                startDate: entry.querySelector('[name="eduStartDate"]').value,
                endDate: entry.querySelector('[name="eduEndDate"]').value
            })),
            experience: Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
                position: entry.querySelector('[name="position"]').value,
                company: entry.querySelector('[name="company"]').value,
                startDate: entry.querySelector('[name="expStartDate"]').value,
                endDate: entry.querySelector('[name="expEndDate"]').value,
                description: entry.querySelector('[name="description"]').value
            })),
            skills: Array.from(document.querySelectorAll('.skill-tag'))
                .map(tag => tag.textContent.trim())
        };
        
        // Generate PDF
        doc.setFontSize(20);
        doc.text(formData.name, 105, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text(formData.jobTitle, 105, 30, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Email: ${formData.email}`, 20, 40);
        if (formData.phone) doc.text(`Phone: ${formData.phone}`, 20, 47);
        
        let yPos = 60;
        
        // Education Section
        doc.setFontSize(16);
        doc.text('Education', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        formData.education.forEach(edu => {
            if (edu.degree && edu.institution) {
                doc.text(`${edu.degree}`, 20, yPos);
                doc.text(`${edu.institution}`, 20, yPos + 7);
                doc.text(`${edu.startDate} - ${edu.endDate}`, 20, yPos + 14);
                yPos += 25;
            }
        });
        
        // Experience Section
        doc.setFontSize(16);
        doc.text('Experience', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        formData.experience.forEach(exp => {
            if (exp.position && exp.company) {
                doc.text(`${exp.position}`, 20, yPos);
                doc.text(`${exp.company}`, 20, yPos + 7);
                doc.text(`${exp.startDate} - ${exp.endDate}`, 20, yPos + 14);
                
                const descriptionLines = doc.splitTextToSize(exp.description, 170);
                doc.text(descriptionLines, 20, yPos + 21);
                yPos += 35 + (descriptionLines.length * 7);
            }
        });
        
        // Skills Section
        if (formData.skills.length > 0) {
            doc.setFontSize(16);
            doc.text('Skills', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(12);
            const skillsText = doc.splitTextToSize(formData.skills.join(', '), 170);
            doc.text(skillsText, 20, yPos);
        }
        
        doc.save(`${formData.name.replace(/\s+/g, '_')}_CV.pdf`);
        
        // Clear form and validation states
        document.getElementById('cvForm').reset();
        document.querySelectorAll('.valid, .invalid').forEach(element => {
            element.classList.remove('valid', 'invalid');
        });
        document.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
        document.getElementById('skillTags').innerHTML = '';
        
    } catch (error) {
        console.error('Error generating CV:', error);
        alert('There was an issue generating the CV. Please try again.');
    }
}
