from config.llm import generate

def report_agent(report_text):

    prompt = f"""
You are a medical report analyzer.

First determine whether the provided text is a medical report.

Examples of medical reports:
- Blood Test
- CBC Report
- X-Ray Report
- MRI Report
- CT Scan Report
- Prescription
- Diagnostic Report
- Lab Report

If the text is NOT a medical report, respond ONLY with:

"This file does not appear to be a medical report."

Otherwise analyze it and provide:

1. Summary
2. Important Findings
3. Possible Concerns
4. Suggested Next Steps

Use simple language.

Report Text:
{report_text}
"""

    return generate(prompt)