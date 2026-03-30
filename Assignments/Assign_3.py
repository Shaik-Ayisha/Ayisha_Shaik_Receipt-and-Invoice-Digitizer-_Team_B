# Example program using enumerate()

students = ["Afsana", "Sara", "John", "Ali", "Maria"]

print("Student List:")

# Using enumerate to get index and value
for index, name in enumerate(students):
    print("Index:", index, "Name:", name)

print("\nStarting index from 1:")

# enumerate with start parameter
for index, name in enumerate(students, start=1):
    print("Student", index, ":", name)

print("\nEnumerate converted to list:")
enum_list = list(enumerate(students))
print(enum_list)