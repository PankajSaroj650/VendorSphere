#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <algorithm>
#include <sstream>
#include <limits>
using namespace std;

class Vendor {
private:
    int vendorId;
    string vendorName;
    string companyName;
    string productService;
    string phone;
    string email;
    double contractValue;
    double rating;
public:
    Vendor() : vendorId(0), contractValue(0), rating(0) {}
    Vendor(int id, string vname, string cname, string prod, string ph, string em, double cv, double r)
        : vendorId(id), vendorName(vname), companyName(cname), productService(prod), phone(ph), email(em), contractValue(cv), rating(r) {}

    int getId() const { return vendorId; }
    double getRating() const { return rating; }

    void input() {
        cout << "Enter Vendor ID: ";
        while (!(cin >> vendorId)) { cin.clear(); cin.ignore(1000, '\n'); cout << "Sahi number likho: "; }
        cin.ignore();
        cout << "Enter Vendor Name: "; getline(cin, vendorName);
        cout << "Enter Company Name: "; getline(cin, companyName);
        cout << "Enter Product/Service: "; getline(cin, productService);
        cout << "Enter Phone: "; getline(cin, phone);
        cout << "Enter Email: "; getline(cin, email);
        cout << "Enter Contract Value: ";
        while (!(cin >> contractValue)) { cin.clear(); cin.ignore(1000, '\n'); cout << "Sahi number likho: "; }
        cout << "Enter Rating (0-5): ";
        while (!(cin >> rating) || rating < 0 || rating > 5) {
            cin.clear(); cin.ignore(1000, '\n');
            cout << "Rating 0-5 ke beech likho: ";
        }
        cin.ignore();
    }

    void display() const {
        cout << "----------------------------------------\n";
        cout << "ID: " << vendorId << " | Name: " << vendorName << "\n";
        cout << "Company: " << companyName << " | Product: " << productService << "\n";
        cout << "Phone: " << phone << " | Email: " << email << "\n";
        cout << "Contract Value: " << contractValue << " | Rating: " << rating << "\n";
    }

    string toFileString() const {
        return to_string(vendorId) + "|" + vendorName + "|" + companyName + "|" + productService + "|" + phone + "|" + email + "|" + to_string(contractValue) + "|" + to_string(rating);
    }

    static bool fromFileString(const string& line, Vendor &v) {
        stringstream ss(line);
        string token;
        try {
            if (!getline(ss, token, '|')) return false;
            v.vendorId = stoi(token);
            getline(ss, v.vendorName, '|');
            getline(ss, v.companyName, '|');
            getline(ss, v.productService, '|');
            getline(ss, v.phone, '|');
            getline(ss, v.email, '|');
            if (!getline(ss, token, '|')) return false;
            v.contractValue = stod(token);
            if (!getline(ss, token, '|')) return false;
            v.rating = stod(token);
        } catch (...) {
            return false; // kharab line ko skip karo, crash mat karo
        }
        return true;
    }
};

vector<Vendor> vendors;
const string FILENAME = "vendors.dat";

void saveToFile() {
    ofstream out(FILENAME);
    for (auto &v : vendors) out << v.toFileString() << "\n";
    out.close();
}
void loadFromFile() {
    vendors.clear();
    ifstream in(FILENAME);
    string line;
    while (getline(in, line)) {
        if (line.empty()) continue;
        Vendor v;
        if (Vendor::fromFileString(line, v)) vendors.push_back(v);
    }
    in.close();
}
int readChoice() {
    int choice;
    while (!(cin >> choice)) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Sahi number (1-7) likho: ";
    }
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    return choice;
}
void addVendor() {
    Vendor v; v.input();
    for (auto &x : vendors) if (x.getId() == v.getId()) { cout << "ID already exists!\n"; return; }
    vendors.push_back(v); saveToFile();
    cout << "Vendor Added Successfully!\n";
}
void displayAll() {
    if (vendors.empty()) { cout << "No vendors found!\n"; return; }
    for (auto &v : vendors) v.display();
}
void searchVendor() {
    cout << "Enter ID to search: ";
    int id = readChoice();
    for (auto &v : vendors) if (v.getId() == id) { v.display(); return; }
    cout << "Vendor Not Found!\n";
}
void updateVendor() {
    cout << "Enter ID to update: ";
    int id = readChoice();
    for (auto &v : vendors) if (v.getId() == id) { cout << "Enter new details:\n"; v.input(); saveToFile(); cout << "Updated!\n"; return; }
    cout << "Vendor Not Found!\n";
}
void deleteVendor() {
    cout << "Enter ID to delete: ";
    int id = readChoice();
    auto it = remove_if(vendors.begin(), vendors.end(), [id](Vendor &v){ return v.getId() == id; });
    if (it != vendors.end()) { vendors.erase(it, vendors.end()); saveToFile(); cout << "Deleted!\n"; }
    else cout << "Vendor Not Found!\n";
}
void showTopRated() {
    vector<Vendor> top;
    for (auto &v : vendors) if (v.getRating() >= 4.0) top.push_back(v);
    sort(top.begin(), top.end(), [](Vendor &a, Vendor &b){ return a.getRating() > b.getRating(); });
    if (top.empty()) { cout << "No Top Rated Vendors!\n"; return; }
    for (auto &v : top) v.display();
}

int main() {
    loadFromFile();
    int choice;
    do {
        cout << "\n===== VENDOR MANAGEMENT SYSTEM =====\n";
        cout << "1. Add Vendor\n2. Display All Vendors\n3. Search Vendor by ID\n4. Update Vendor\n5. Delete Vendor\n6. Show Top Rated Vendors (>=4.0)\n7. Exit\nEnter choice: ";
        choice = readChoice();
        switch(choice) {
            case 1: addVendor(); break;
            case 2: displayAll(); break;
            case 3: searchVendor(); break;
            case 4: updateVendor(); break;
            case 5: deleteVendor(); break;
            case 6: showTopRated(); break;
            case 7: cout << "Exiting... Data Saved!\n"; break;
            default: cout << "Invalid Choice!\n";
        }
    } while(choice != 7);
    return 0;
}
