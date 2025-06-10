**Chuẩn bị môi trường cài đặt**
-	Yêu cầu hệ điều hành:
> Thiết bị Android: Android 5.0 (Lolipop) trở lên.
> 
> Thiết bị iOS: iOS 12.0 trở lên.
-	Dung lượng bộ nhớ trống yêu cầu: Khoảng 100 MB hoặc hơn tùy thuộc vào dữ liệu người dùng.
-	Kết nối mạng: Ứng dụng yêu cầu kết nối Internet để thực hiện các chức năng như đăng nhập, đăng ký, đồng bộ dữ liệu với Firebase và các tương tác khác với Backend.
-	Cài đặt các phần mềm cần thiết (cho môi trường phát triển): 
> Node.js và npm (hoặc Yarn): Cần cài đặt phiên bản ổn định của Node.js (khuyên dùng phiên bản LTS) để quản lý các gói phụ thuộc.
> 
> Expo CLI: Cần cài đặt công cụ dòng lệnh Expo CLI toàn cục bằng npm install -g expo-cli hoặc npm install -g expo.
> 
> Expo Go App: Cần cài đặt ứng dụng "Expo Go" trên thiết bị di động thực tế (có sẵn trên Google Play Store và Apple App Store) để quét mã QR và chạy ứng  dụng trong quá trình phát triển.
  
**Hướng dẫn cài đặt và triển khai ứng dụng**
-	Cài đặt và chạy trong môi trường phát triển cục bộ:
    -	Clone mã nguồn: Tải mã nguồn của ứng dụng về máy tính bằng cách sử dụng Git:
    > `git clone <đường_dẫn_đến_repository_của_bạn>`
    > 
    > `cd <tên_thư_mục_dự_án>`
    - Cài đặt các gói phụ thuộc: Sử dụng npm hoặc Yarn để cài đặt tất cả các thư viện và gói phụ thuộc được liệt kê trong package.json:
    > `npm install`
    > 
    > hoặc
    > 
    > `yarn install`
    -	Khởi động ứng dụng: Chạy lệnh sau để khởi động máy chủ phát triển Expo:
    > `expo start`
    > 
    > hoặc
    > 
    > `npm start`
    - Chạy trên thiết bị/mô phỏng:
    > Trên thiết bị thực: Mở ứng dụng "Expo Go" trên điện thoại, sau đó quét mã QR hiển thị trên terminal hoặc trong trình duyệt web của Expo Dev Tools.
    > 
    > Trên Android Emulator: Nhấn phím a trên terminal hoặc chọn "Run on Android device/emulator" từ Expo Dev Tools. Đảm bảo đã cài đặt Android Studio và cấu hình AVD.
    > 
    > Trên iOS Simulator (chỉ với macOS): Nhấn phím i trên terminal hoặc chọn "Run on iOS simulator" từ Expo Dev Tools. Đảm bảo đã cài đặt Xcode.
-	Cấu hình Firebase:
    - Để ứng dụng có thể kết nối và sử dụng các dịch vụ của Firebase (Xác thực, Cơ sở dữ liệu), cần đảm bảo rằng dự án Firebase đã được thiết lập đúng cách và các tệp cấu hình đã được đặt vào đúng vị trí trong thư mục dự án (thường được Expo CLI xử lý trong quá trình build nếu cấu hình trong app.json).
