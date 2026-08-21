export type Region = '基隆' | '台北' | '新北' | '桃園' | '新竹' | '苗栗' | '台中' | '彰化' | '南投' | '雲林' | '嘉義' | '台南' | '高雄' | '屏東' | '宜蘭' | '花蓮' | '台東' | '澎湖' | '金門' | '馬祖';
export type BroadArea = '全部' | '基隆' | '台北' | '新北' | '桃園' | '新竹' | '苗栗' | '台中' | '彰化' | '南投' | '雲林' | '嘉義' | '台南' | '高雄' | '屏東' | '宜蘭' | '花蓮' | '台東' | '澎湖' | '金門' | '馬祖' | '北部' | '中部' | '南部' | '東部' | '離島';

export interface SmallPeak {
  id: number;
  townshipCode: string;
  district: string;
  name: string;
  county: string;
  region: Region;
  lat: number;
  lng: number;
  govSource: string;
  highlight?: string;
}

export interface HikerProfile {
  nickname: string;
  email: string;
  avatar?: string;
  completedPeakIds: number[];
  certId: string;
  finishDate?: string;
  levelTitle: string;
  motto?: string;
}

