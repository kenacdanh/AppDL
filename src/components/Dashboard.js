import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import axios from "axios";
import io from "socket.io-client";
import VideoStream from "./VideoStream"; // Đảm bảo đường dẫn đúng nếu VideoStream ở file khác

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]); // State để lưu dữ liệu xe
  const [selectedTab, setSelectedTab] = useState("entry"); // Cổng vào mặc định
  const socketRef = useRef(null); // Ref để giữ socket

  // Khởi tạo Socket.IO chỉ một lần khi component mount
  useEffect(() => {
    socketRef.current = io("http://192.168.1.2:5000"); // Đổi với địa chỉ IP của server bạn

    // Lắng nghe cập nhật từ Socket.IO
    socketRef.current.on("vehicle_log_update", () => {
      fetchVehicles(selectedTab); // Gọi lại fetch khi có cập nhật với cổng hiện tại
    });

    // Cleanup khi component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []); // Chạy một lần khi component mount

  // Fetch vehicle data mỗi khi selectedTab thay đổi
  useEffect(() => {
    setVehicles([]); // Reset dữ liệu xe trước khi gọi lại API
    fetchVehicles(selectedTab); // Gọi fetchVehicles với cổng hiện tại
  }, [selectedTab]); // Mỗi khi selectedTab thay đổi, gọi lại fetchVehicles

  const fetchVehicles = async (gate) => {
    try {
      const response = await axios.get(
        `http://192.168.1.2:5000/api/vehicles?gate=${gate}` // Lọc theo cổng vào/ra
      );
      console.log("Dữ liệu từ server:", response.data); // Log dữ liệu nhận được từ API
      setVehicles(response.data); // Cập nhật lại dữ liệu cho vehicles
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hệ Thống Giám Sát Phương Tiện</Text>

      {/* Video Stream - Chiều cao cố định */}
      <View style={styles.videoContainer}>
        <VideoStream /> {/* Nhúng VideoStream component ở đây */}
      </View>

      {/* Tab Bar */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "entry" && styles.selectedTab]}
          onPress={() => setSelectedTab("entry")} // Chọn cổng vào
        >
          <Text style={styles.tabText}>Cổng Vào</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "exit" && styles.selectedTab]}
          onPress={() => setSelectedTab("exit")} // Chọn cổng ra
        >
          <Text style={styles.tabText}>Cổng Ra</Text>
        </TouchableOpacity>
      </View>

      {/* Bảng dữ liệu */}
      <ScrollView style={styles.table}>
        {/* Table Header */}
        <View style={styles.row}>
          <Text style={styles.headerCell}>Biển Số</Text>
          <Text style={styles.headerCell}>Thời Gian Vào</Text>
          <Text style={styles.headerCell}>Thời Gian Ra</Text>
          <Text style={styles.headerCell}>Cổng</Text>
        </View>

        {/* Dữ liệu bảng */}
        {vehicles.filter((item) => item.gate == selectedTab).length === 0 ? (
          <Text style={styles.noDataText}>Không có dữ liệu</Text> // Hiển thị thông báo nếu không có dữ liệu
        ) : (
          vehicles.map((item) => {
            return (
              <View style={styles.row} key={item.id}>
                <Text style={styles.cell}>
                  {item.plate ? item.plate : "---"}
                </Text>
                <Text style={styles.cell}>
                  {item.entry_time ? item.entry_time : "---"}
                </Text>
                <Text style={styles.cell}>
                  {item.exit_time ? item.exit_time : "---"}
                </Text>
                <Text style={styles.cell}>{item.gate ? item.gate : "---"}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center"
  },
  videoContainer: {
    height: 200, // Đặt chiều cao cố định cho video stream
    marginBottom: 16 // Khoảng cách giữa video và tab
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center"
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: "#ddd"
  },
  selectedTab: {
    backgroundColor: "#4CAF50"
  },
  tabText: {
    fontSize: 18,
    color: "#fff"
  },
  table: {
    flex: 1, // Bảng sẽ chiếm không gian còn lại
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center"
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    paddingHorizontal: 8
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    paddingHorizontal: 8
  },
  noDataText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    padding: 16
  }
});

export default Dashboard;
