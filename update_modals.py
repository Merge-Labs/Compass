import os
import re

# Define the files to update
files_to_update = [
    "nisria-frontend/src/components/programs/details/EducationBeneficiaryDetailModal.jsx",
    "nisria-frontend/src/components/programs/details/MicrofundBeneficiaryDetailModal.jsx",
    "nisria-frontend/src/components/programs/details/RescueBeneficiaryDetailModal.jsx",
    "nisria-frontend/src/components/programs/details/VocationalTraineeDetailModal.jsx",
    "nisria-frontend/src/components/programs/forms/RescueBeneficiaryForm.jsx",
    "nisria-frontend/src/components/programs/forms/MicrofundBeneficiaryForm.jsx",
    "nisria-frontend/src/components/programs/forms/VocationalTraineeForm.jsx"
]

def update_file(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()

        # Check if ModalPortal is already imported
        if 'import ModalPortal' not in content:
            # Add import at the top with other imports
            content = re.sub(
                r'(import React[^;\n]+[;\n])',
                r'\1import ModalPortal from \'../../common/ModalPortal\';\n',
                content,
                count=1
            )

        # Update the modal structure
        content = re.sub(
            r'(return \()\s*<div\s+className=[\'"]([^\'"]*?fixed[^\'"]*?)[\'"]',
            r'\1<ModalPortal>\n      <div className="\2"',
            content
        )

        # Add the wrapper divs and close ModalPortal
        content = re.sub(
            r'(<div\s+className=[\'"]([^\'"]*?bg-white[^\'"]*?)[\'"])',
            r'<div className="relative w-full max-w-3xl max-h-[90vh]">\n        <div className="\2',
            content
        )

        # Close the wrapper divs and ModalPortal
        content = re.sub(
            r'(</div>\s*</div>\s*</div>\s*;\s*}$)',
            r'        </div>\n      </div>\n    </div>\n  </ModalPortal>\1',
            content
        )

        with open(file_path, 'w') as file:
            file.write(content)
        
        print(f"Updated {file_path}")
        return True

    except Exception as e:
        print(f"Error updating {file_path}: {str(e)}")
        return False

# Update all files
for file_path in files_to_update:
    full_path = os.path.join(os.path.expanduser("~"), "Projects", "Compass", file_path)
    if os.path.exists(full_path):
        update_file(full_path)
    else:
        print(f"File not found: {full_path}")
