/**
 * 信息查询 -> 空教室查询页
 */
import React, { Component } from "react";
import {
    View,
    Text,
    Dimensions,
    WebView,
    StyleSheet,
    Linking,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Alert,
    StatusBar,
    Platform,
    SafeAreaView
} from "react-native";
import { Header, Button } from "react-native-elements";
import EIcon from "react-native-vector-icons/Entypo";
import Dialog, {
    ScaleAnimation,
    DialogContent
} from "react-native-popup-dialog";
import Global from "../../src/Global";
import { DatePicker } from "react-native-pickers";
import EmptyRoomPicker from "../../src/Query/EmptyRoomPicker";
import ClassPicker from "../../src/Query/ClassPicker";
//data
import campus from "../../src/Query/data/campus.json";
import building from "../../src/Query/data/building.json";

const { width, height } = Dimensions.get("window");

export default class EmptyRoomPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: ["年", "月", "日"],
            date: "",
            campusNameList: [],
            campusSelected: 0,
            campusId: "",
            buildingNameList: [],
            buildingSelected: 0,
            buildingId: "",
            classBegin: 1,
            classEnd: 1,
            showLoading: false,
            dialogVisible: false,
            getRoomList: false,
            roomList: []
        };
    }

    componentDidMount() {
        if (!Global.isOnline) {
            Alert.alert(
                "提示",
                "登录后才能查空教室哟~",
                [
                    {
                        text: "知道啦",
                        onPress: () => this.props.navigation.navigate("Main")
                    }
                ],
                { cancelable: false }
            );
        }
        var campusNameList = [];
        for (var i in campus) {
            campusNameList.push(campus[i].name);
        }
        this.setState({
            date: new Date().toJSON().substring(0, 10),
            campusNameList: campusNameList
        });
        this.changeCampus(campus[0].value);
    }
    /**
     * 处理换校区后切换教学楼
     */
    changeCampus(campusId) {
        var _buildingNameList = [];
        _campusId = parseInt(campusId.substring(3, 4));
        for (var i in building[_campusId - 1]) {
            _buildingNameList.push(building[_campusId - 1][i].name);
        }
        this.setState({
            campusId: campusId,
            buildingNameList: _buildingNameList,
            buildingSelected: 0,
            buildingId: building[_campusId - 1][0].value
        });
    }

    openDrawer() {
        // 打开抽屉式导航
        this.props.navigation.openDrawer();
    }

    renderButton(text, callback) {
        return (
            <TouchableOpacity
                onPress={callback.bind(this)}
                style={{ padding: 15, paddingBottom: 0 }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderColor: "#ccc",
                        borderWidth: 1,
                        paddingVertical: 10,
                        borderRadius: 3,
                        flexDirection: "row",
                        backgroundColor: "#fff"
                    }}
                >
                    <Text style={{ flex: 8, paddingLeft: 15 }}>{text}</Text>
                    <EIcon style={{ flex: 1 }} size={18} name="chevron-down" />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { navigate } = this.props.navigation;
        var headerStyle = {
            borderBottomColor: Global.settings.theme.backgroundColor
        };
        if (Platform.OS == "ios") {
            headerStyle.paddingTop = 0;
            headerStyle.height = 44;
        }
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: Global.settings.theme.backgroundColor
                }}
            >
                <StatusBar
                    backgroundColor={Global.settings.theme.backgroundColor}
                    barStyle="light-content"
                    translucent={false}
                />
                <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
                    <Header
                        containerStyle={headerStyle}
                        backgroundColor={Global.settings.theme.backgroundColor}
                        placement="left"
                        leftComponent={
                            <Button
                                title=""
                                icon={
                                    <EIcon
                                        name="chevron-left"
                                        size={28}
                                        color="white"
                                    />
                                }
                                clear
                                onPress={() =>
                                    this.props.navigation.navigate("Main")
                                }
                            />
                        }
                        centerComponent={{
                            text: "空教室查询",
                            style: { color: "#fff", fontSize: 16 }
                        }}
                    />
                    {Global.isOnline || 1 ? (
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                {this.renderButton(
                                    this.state.campusNameList[
                                        this.state.campusSelected
                                    ],
                                    () => {
                                        this.EmptyRoomPicker1.show();
                                    }
                                )}
                                {this.renderButton(
                                    this.state.buildingNameList[
                                        this.state.buildingSelected
                                    ],
                                    () => {
                                        this.EmptyRoomPicker2.show();
                                    }
                                )}
                                {this.renderButton(this.state.date, () => {
                                    this.DatePicker.show();
                                })}
                                {this.renderButton(
                                    "从第" +
                                        this.state.classBegin +
                                        "节    到第" +
                                        this.state.classEnd +
                                        "节",
                                    () => {
                                        this.ClassPicker.show();
                                    }
                                )}
                                <EmptyRoomPicker
                                    list={this.state.campusNameList}
                                    ref={ref => (this.EmptyRoomPicker1 = ref)}
                                    itemTextColor="#808080"
                                    itemSelectedColor={
                                        Global.settings.theme.backgroundColor
                                    }
                                    onPickerCancel={() => {}}
                                    onPickerConfirm={value => {
                                        var campusSelected = 0;
                                        var campusId = "";
                                        while (campus[campusSelected]) {
                                            if (
                                                campus[campusSelected].name ==
                                                value
                                            ) {
                                                campusId =
                                                    campus[campusSelected]
                                                        .value;
                                                break;
                                            }
                                            campusSelected++;
                                        }
                                        this.setState({
                                            campusSelected: campusSelected
                                        });
                                        this.changeCampus(campusId);
                                    }}
                                    itemHeight={50}
                                />
                                <EmptyRoomPicker
                                    list={this.state.buildingNameList}
                                    ref={ref => (this.EmptyRoomPicker2 = ref)}
                                    itemTextColor="#808080"
                                    itemSelectedColor={
                                        Global.settings.theme.backgroundColor
                                    }
                                    onPickerCancel={() => {}}
                                    onPickerConfirm={value => {
                                        var buildingSelected = 0;
                                        var buildingId = "";
                                        var campusId = this.state.campusId;
                                        campusId = parseInt(
                                            campusId.substring(3, 4)
                                        );
                                        while (
                                            building[campusId - 1][
                                                buildingSelected
                                            ]
                                        ) {
                                            if (
                                                building[campusId - 1][
                                                    buildingSelected
                                                ].name == value
                                            ) {
                                                buildingId =
                                                    building[campusId - 1][
                                                        buildingSelected
                                                    ].value;

                                                break;
                                            }
                                            buildingSelected++;
                                        }
                                        this.setState({
                                            buildingId: buildingId,
                                            buildingSelected: buildingSelected
                                        });
                                    }}
                                    itemHeight={50}
                                />
                                <DatePicker
                                    unit={this.state.unit}
                                    HH={false}
                                    mm={false}
                                    ss={false}
                                    itemTextColor="#808080"
                                    itemSelectedColor={
                                        Global.settings.theme.backgroundColor
                                    }
                                    onPickerConfirm={value => {
                                        var year = value[0].substring(0, 4);
                                        var month = "";
                                        if (value[1].length == 2) {
                                            month =
                                                "0" + value[1].substring(0, 1);
                                        } else {
                                            month = value[1].substring(0, 2);
                                        }
                                        var day = value[2].substring(0, 2);
                                        this.setState({
                                            date: year + "-" + month + "-" + day
                                        });
                                    }}
                                    onPickerCancel={() => {}}
                                    ref={ref => (this.DatePicker = ref)}
                                />
                                <ClassPicker
                                    ref={ref => (this.ClassPicker = ref)}
                                    itemTextColor="#808080"
                                    itemSelectedColor={
                                        Global.settings.theme.backgroundColor
                                    }
                                    onPickerCancel={() => {}}
                                    onPickerConfirm={value => {
                                        this.setState({
                                            classBegin: value.begin,
                                            classEnd: value.end
                                        });
                                    }}
                                    itemHeight={50}
                                />
                                <View
                                    style={{
                                        paddingHorizontal: 15,
                                        paddingVertical: 20
                                    }}
                                >
                                    <Button
                                        containerStyle={{
                                            position: "absolute",
                                            left: 0,
                                            right: 0,
                                            zIndex: 0,
                                            paddingHorizontal: 30,
                                            paddingVertical: 30
                                        }}
                                        title="查询"
                                        buttonStyle={{
                                            height: 45,
                                            backgroundColor:
                                                Global.settings.theme
                                                    .backgroundColor
                                        }}
                                        loading={this.state.showLoading}
                                        outline={true}
                                        onPress={this.getRoomList.bind(this)}
                                    />
                                </View>
                                <Dialog
                                    visible={this.state.dialogVisible}
                                    dialogAnimation={new ScaleAnimation()}
                                    onTouchOutside={() => {
                                        this.setState({
                                            dialogVisible: false
                                        });
                                    }}
                                    width={0.9}
                                    height={0.75}
                                >
                                    <DialogContent>
                                        <View style={{ paddingVertical: 10 }}>
                                            {this.state.getRoomList ? (
                                                <FlatList
                                                    showsVerticalScrollIndicator={
                                                        false
                                                    }
                                                    data={this.state.roomList.slice(
                                                        0,
                                                        this.state.roomList
                                                            .length - 1
                                                    )}
                                                    ListHeaderComponent={
                                                        <View
                                                            style={styles.row}
                                                        >
                                                            <View
                                                                style={[
                                                                    styles.item,
                                                                    { flex: 3 }
                                                                ]}
                                                            >
                                                                <Text>
                                                                    教室名称
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={[
                                                                    styles.item,
                                                                    { flex: 2 }
                                                                ]}
                                                            >
                                                                <Text>
                                                                    容量(人)
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={[
                                                                    styles.item,
                                                                    { flex: 2 }
                                                                ]}
                                                            >
                                                                <Text>
                                                                    注释
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    }
                                                    renderItem={({ item }) => (
                                                        <View
                                                            style={styles.row}
                                                        >
                                                            <View
                                                                style={[
                                                                    styles.item,
                                                                    { flex: 3 }
                                                                ]}
                                                            >
                                                                <Text>
                                                                    {item.name}
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={[
                                                                    styles.item,
                                                                    { flex: 2 }
                                                                ]}
                                                            >
                                                                <Text>
                                                                    {
                                                                        item.volume
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={[
                                                                    styles.item,
                                                                    { flex: 2 }
                                                                ]}
                                                            >
                                                                <Text>
                                                                    {item.notes}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    ListFooterComponent={
                                                        <View
                                                            style={[
                                                                styles.row,
                                                                {
                                                                    borderBottomWidth: 0
                                                                }
                                                            ]}
                                                        >
                                                            <View
                                                                style={[
                                                                    styles.item,
                                                                    { flex: 3 }
                                                                ]}
                                                            >
                                                                <Text>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .roomList[
                                                                            this
                                                                                .state
                                                                                .roomList
                                                                                .length -
                                                                                1
                                                                        ].name
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={[
                                                                    styles.item,
                                                                    { flex: 2 }
                                                                ]}
                                                            >
                                                                <Text>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .roomList[
                                                                            this
                                                                                .state
                                                                                .roomList
                                                                                .length -
                                                                                1
                                                                        ].volume
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={[
                                                                    styles.item,
                                                                    { flex: 2 }
                                                                ]}
                                                            >
                                                                <Text>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .roomList[
                                                                            this
                                                                                .state
                                                                                .roomList
                                                                                .length -
                                                                                1
                                                                        ].notes
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    }
                                                />
                                            ) : null}
                                        </View>
                                    </DialogContent>
                                </Dialog>
                            </View>
                        </View>
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                paddingVertical: height / 2 - 150,
                                backgroundColor: "transparent"
                            }}
                        >
                            <ActivityIndicator
                                size="large"
                                color={Global.settings.theme.backgroundColor}
                            />
                        </View>
                    )}
                </View>
            </SafeAreaView>
        );
    }
    /**
     * 点击查询后，拿到空教室列表
     */
    getRoomList() {
        if (this.state.showLoading) return;
        this.setState({ showLoading: true });

        var cs = 0;
        var begin = this.state.classBegin;
        var end = this.state.classEnd;
        if (begin == end) cs = Math.pow(2, begin);
        else cs = Math.pow(2, begin) * 3;
        let URL = "http://10.60.65.8/ntms/service/res.do";
        fetch(URL, {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "zh-CN,zh;q=0.9",
                Connection: "keep-alive",
                "Content-Type": "application/json",
                Cookie:
                    "loginPage=userLogin.jsp; pwdStrength=1; alu=" +
                    Global.loginInfo.j_username +
                    "; " +
                    Global.cookie,
                Host: "10.60.65.8",
                Origin: "http://10.60.65.8",
                Referer: "http://10.60.65.8/ntms/index.do"
            },
            body: JSON.stringify({
                tag: "roomIdle@roomUsage",
                branch: "default",
                params: {
                    termId: Global.defRes.termId,
                    bid: this.state.buildingId,
                    rname: "",
                    dateActual: {},
                    cs: cs,
                    d_actual: this.state.date + "T00:00:00+08:00"
                }
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                responseJson = responseJson.value;
                var roomList = [];
                for (var i in responseJson) {
                    var item = {};
                    item.name = responseJson[i].roomNo;
                    item.volume = responseJson[i].volume;
                    item.notes = responseJson[i].notes;
                    roomList.push(item);
                }
                this.setState({
                    roomList: roomList,
                    showLoading: false,
                    getRoomList: true,
                    dialogVisible: true
                });
            })
            .catch(error => {
                if (__DEV__) {
                    console.log("getCampus error");
                    console.error(error);
                    console.log(responseJson);
                }
            });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },
    item: {
        padding: 10,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        textAlignVertical: "center"
    }
});
