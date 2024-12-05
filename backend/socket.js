import { Server } from "socket.io"; // Import thư viện Socket.IO để tạo server WebSocket
import { saveMessage } from "./controllers/chatController.js"; // Import hàm lưu tin nhắn từ chatController
import { likePost, createNotification, createComment } from "./controllers/postController.js"; // Import các hàm xử lý bài đăng

// Hàm cấu hình Socket.IO với server HTTP
export default function configureSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", // Cho phép mọi nguồn (origin) truy cập WebSocket (do CORS)
        },
    });

    // Middleware để kiểm tra userId trong kết nối WebSocket
    io.use((socket, next) => {
        const userId = socket.handshake.query.userId; // Lấy userId từ query trong quá trình bắt tay (handshake)
        if (!userId) {
            return next(new Error("Invalid userId")); // Nếu không có userId, trả về lỗi
        } else {
            socket.userId = socket.handshake.query.userId; // Gắn userId vào socket để sử dụng sau này
            next(); // Tiếp tục nếu hợp lệ
        }
    });

    // Sự kiện xảy ra khi một client kết nối
    io.on('connection', (socket) => {
        socket.join(socket.userId); // Thêm userId vào một room để dễ quản lý kết nối

        // Thông báo người dùng khác rằng user này đã online
        socket.broadcast.emit("userConnected", {
            userID: socket.id // Gửi ID của người dùng vừa kết nối cho những người dùng khác
        });

        // Xử lý sự kiện gửi tin nhắn
        socket.on('sendMessage', (message) => {
            // Gửi tin nhắn đến cả người gửi và người nhận (2 người)
            socket.to(message.sentUserId).to(message.receivedUserId).emit('receiveMessage', message);
            saveMessage(message); // Lưu tin nhắn vào database thông qua hàm saveMessage
        });

        // Xử lý sự kiện gửi lời mời kết bạn
        socket.on('sendFriendRequest', (request) => {
            socket.to(request.friendId).emit('receiveFriendRequest', request); // Gửi lời mời kết bạn đến người nhận
        });

        // Xử lý sự kiện tạo comment
        socket.on('createComment', (request) => {
            socket.to(request.postUserId).emit('createComment', request); // Gửi thông báo về comment đến chủ bài đăng
            createNotification({
                ...request, // Tạo thông báo cho người dùng
                type: 'comment' // Loại thông báo là comment
            });
            createComment(request); // Lưu comment vào database thông qua hàm createComment
        });

        // Xử lý sự kiện like bài đăng
        socket.on('likePost', (request) => {
            socket.to(request.postUserId).emit('likePost', request); // Gửi thông báo bài đăng được like đến chủ bài đăng
            createNotification({
                ...request, // Tạo thông báo cho người dùng
                type: 'like' // Loại thông báo là like
            });
            likePost(request); // Lưu hành động like vào database thông qua hàm likePost
        });

        // Sự kiện xảy ra khi client ngắt kết nối (offline)
        socket.on('disconnect', () => {
            socket.broadcast.emit("userDisconnected", {
                userID: socket.id // Thông báo đến các user khác rằng user này đã ngắt kết nối
            });
        });
    });
}
