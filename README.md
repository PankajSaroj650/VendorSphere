# VendorSphere - Perfect Working Version
Team Size: 3 | Web + C++ Vendor & Procurement Management System

## Kaise Chalaye (Web)
1. ZIP extract karo
2. index.html par DOUBLE CLICK karo - browser me khul jayega
3. Koi server / internet ki zaroorat NAHI hai

## C++ Version
g++ VendorManagementSystem.cpp -o vendor
./vendor   (Windows: vendor.exe)

## Kya fix kiya gaya
- Web: galat / kharab LocalStorage data se crash nahi hoga
- Web: naam me < > , likhne par bhi table / CSV kharab nahi hoga
- Web: email, phone, rating, negative value ki sahi checking
- Web: Edit karte time vendor na mile to error, blank update nahi hoga
- C++: galat number / rating likhne par loop / crash nahi hoga
- C++: kharab vendors.dat line skip hogi, poora data kharab nahi hoga
