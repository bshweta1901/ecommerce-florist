import pandas as pd

from app.main.exceptation.custom_exception import CustomException
from ...user.model.user import User


def validate_field_data(data, field_data):
    field_data = str(field_data)
    # if not email:
    #     raise ValueError("Email is required")
    if field_data:
        if User.query.filter(getattr(User, data) == field_data).first():
            return True


def check_file_type(file):
    if file.filename.endswith(".csv"):
        try:
            df = pd.read_csv(file)
            return df
        except Exception as e:
            raise e
    elif file.filename.endswith(".xlsx") or file.filename.endswith(".xls"):
        try:
            # content = file.read()
            df = pd.read_excel(file)
            print("Excel file loaded successfully.")
            return df
        except Exception as e:
            print("Error loading Excel file:", e)
            raise e
    else:
        raise CustomException(
            status_code=400,
            message="Unsupported file format. Please provide a CSV or Excel file.",
        )


def check_duplicate_data(fields, df):
    duplicate_data = (
        {}
    )  # Dictionary to store row number and duplicate email,phone,username
    rows_to_delete = []  # List to store row numbers to delete
    # Convert all column names to lowercase
    df.columns = df.columns.str.lower()
    for index, row in df.iterrows():
        for data in fields:
            if data in df.columns:
                field_data = row[data]
                if field_data is not None:
                    check_duplicate = validate_field_data(data, field_data)
                    if check_duplicate:
                        # Store the row number and email in the dictionary
                        duplicate_data[index] = field_data
                        rows_to_delete.append(index)
    df.drop(rows_to_delete, inplace=True)
    return duplicate_data, df
