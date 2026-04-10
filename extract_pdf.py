import fitz # PyMuPDF

def extract_toc():
    file_path = r"src/curriculum/data/EIS IB corricullum.pdf"
    try:
        doc = fitz.open(file_path)
        toc = doc.get_toc() # [[level, title, page], ...]
        if toc:
            print("Table of Contents from PyMuPDF:")
            count = 0
            for item in toc:
                if item[0] <= 2: # top headers
                    print(f"L{item[0]}: {item[1]} (Page {item[2]})")
                    count += 1
                if count > 50:
                    break
        else:
            print("No TOC found. Attempting to extract text from pages...")
            for i in range(min(15, len(doc))):
                page = doc.load_page(i)
                text = page.get_text()
                for line in text.split('\n'):
                    if len(line.strip()) > 3:
                        print(line.strip())
                if "CONTENTS" in text.upper():
                    print("Found contents page.")
                    # Keep extracting if we found contents page
                    for j in range(i+1, min(i+5, len(doc))):
                        text = doc.load_page(j).get_text()
                        for line in text.split('\n'):
                            if len(line.strip()) > 3:
                                print(line.strip())
                    break

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_toc()
