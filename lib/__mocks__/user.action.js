// __mocks__/user.action.js
export const getCurrentUser = jest.fn(() =>
  Promise.resolve({
    name: "John Doe",
    uniNumber: "12345",
    birthDate: "2000-01-01",
    nationalNumber: "987654321",
    nationality: "Egyptian",
    specialization: "Computer Science",
    role: { name: "student" },
  })
);

// __mocks__/company.action.js
export const getAllCompanies = jest.fn(() =>
  Promise.resolve([
    { id: 1, name: "Company A", status: "active" },
    { id: 2, name: "Company B", status: "inactive" },
  ])
);
