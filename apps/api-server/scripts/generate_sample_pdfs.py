"""Script to generate sample PDF documents for testing"""
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os

def create_sample_resume():
    """Create a sample resume PDF"""
    output_path = os.path.join(os.path.dirname(__file__), "..", "..", "docs", "sample_resume.pdf")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    c = canvas.Canvas(output_path, pagesize=letter)
    
    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(300, 750, "JANE SMITH")
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(300, 735, "Email: jane.smith@email.com | Phone: +1-555-123-4567")
    
    # Summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 700, "PROFESSIONAL SUMMARY")
    c.setFont("Helvetica", 10)
    c.drawString(50, 685, "Full Stack Developer with 3 years of experience in web development.")
    c.drawString(50, 673, "Skilled in building modern applications using React and FastAPI.")
    
    # Skills
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 645, "SKILLS")
    c.setFont("Helvetica", 10)
    c.drawString(50, 630, "JavaScript, TypeScript, React, Node.js, Python, FastAPI, PostgreSQL,")
    c.drawString(50, 618, "Docker, Git, AWS, MongoDB, Redis, GraphQL, REST APIs")
    
    # Experience
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 585, "WORK EXPERIENCE")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 570, "Full Stack Developer - ABC Company (2021-Present)")
    c.setFont("Helvetica", 10)
    c.drawString(50, 555, "- Developed and maintained web applications using React and FastAPI")
    c.drawString(50, 543, "- Implemented RESTful APIs serving 10,000+ daily users")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 520, "Junior Developer - XYZ Startup (2020-2021)")
    c.setFont("Helvetica", 10)
    c.drawString(50, 505, "- Built frontend components using React and TypeScript")
    c.drawString(50, 493, "- Collaborated with team on agile development practices")
    
    # Education
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 460, "EDUCATION")
    c.setFont("Helvetica", 10)
    c.drawString(50, 445, "B.Sc. Computer Science - State University (2020)")
    c.drawString(50, 433, "GPA: 3.8/4.0")
    
    c.save()
    print(f"Created: {output_path}")

if __name__ == "__main__":
    create_sample_resume()
