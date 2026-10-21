import pandas as pd

file_path = r'd:\UINSA\SAD\Aplikasi\MBKM1-10_2_Waterfall_SAD 12123.xlsx'
xls = pd.ExcelFile(file_path)

for s in xls.sheet_names:
    if 'impl' in s.lower() or '4' in s:
        df = pd.read_excel(xls, sheet_name=s, header=None)
        print(f'=== {s} ({len(df)} rows x {len(df.columns)} cols) ===')
        pd.set_option('display.max_colwidth', 200)
        pd.set_option('display.width', 500)
        print(df.to_string())
