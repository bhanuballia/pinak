from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet


class PDFReportGenerator:

    def generate(self, filename, report_text):

        doc = SimpleDocTemplate(filename)

        styles = getSampleStyleSheet()

        elements = []

        elements.append(
            Paragraph(
                "AI Dasha Report",
                styles['Heading1']
            )
        )

        elements.append(Spacer(1, 12))

        elements.append(
            Paragraph(
                report_text,
                styles['BodyText']
            )
        )

        doc.build(elements)
