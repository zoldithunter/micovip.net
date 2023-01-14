<template>
    <b-container>
      <b-row>
        <b-col>
          <b-carousel
              :interval="5000"
              controls
              indicators
              background="#ababab"
              img-width="1200"
              img-height="400"
          >
            <b-carousel-slide
                :img-src="carousel1"
            ></b-carousel-slide>
          </b-carousel>
        </b-col>
      </b-row>

<!--      <b-row>-->
<!--        <b-col>-->
<!--          <b-navbar toggleable="lg" type="light" style="background-color: deepskyblue">-->
<!--            <b-navbar-nav style="width: 100%">-->
<!--              <b-nav-item-->
<!--                  v-b-hover="hoverDashboard"-->
<!--                  style="font-weight: bolder; border: 1px solid rgba(255, 0, 0, .2); border-radius: 10px"-->
<!--                  target="_blank" href="https://nimovip.com/dashboard">-->
<!--                <b-icon-dice6 v-if="isHoverDashboard" animation="spin"/>-->
<!--                <b-icon-dice6 v-else/>-->
<!--                BẢNG CẦU-->
<!--              </b-nav-item>-->
<!--              <b-nav-item-->
<!--                  v-b-hover="hoverRegister"-->
<!--                  style="font-weight: bolder; border: 1px solid rgba(255, 0, 0, .2); border-radius: 10px; margin-left: 3px"-->
<!--                  target="_blank" href="https://nimovip.com/register">-->
<!--                <b-icon-pen v-if="isHoverRegister" animation="cylon-vertical"/>-->
<!--                <b-icon-pen v-else/>-->
<!--                ĐĂNG KÝ-->
<!--              </b-nav-item>-->
<!--            </b-navbar-nav>-->
<!--          </b-navbar>-->
<!--        </b-col>-->
<!--      </b-row>-->

      <b-row v-if="isOutOfStock">
        <b-col>
          <b-alert show variant="success">
            <h4 class="alert-heading">KC vừa hết xong các khách ạ!!! Chin nhỗi nha</h4>
            <b-img style="margin: auto" :src="sr"/>
          </b-alert>
        </b-col>
      </b-row>
      <b-row v-else>
        <!--Content-->
        <b-col>
          <b-container style="padding-left: 0; padding-right: 0">
            <!--List price-->
            <b-row v-if="payment === false" style="margin-top: 20px">
              <b-col>
                <b-card
                    header="DANH SÁCH GIÁ XU"
                    class="text-left"
                >
                  <b-container>
                    <b-row>
                      <b-col>
                        <b-input-group class="mb-2"
                                       style="padding-bottom: 20px; border-bottom: 1px solid #ccc">
                          <b-input-group-prepend is-text>
                            <b-icon icon="credit-card2-front"></b-icon>
                          </b-input-group-prepend>
                          <b-form-input v-model="nimoID" type="text"
                                        placeholder="Điền số ID MICO bạn muốn nạp"></b-form-input>
                        </b-input-group>
                      </b-col>
                    </b-row>
                    <b-row v-for="idx in Math.ceil(listPrice.length/numberColPerRow)" :key="idx">
                      <b-col style="margin-bottom: 15px" cols="6" sm="2"
                             v-for="(item) in listPrice.slice((idx-1)*numberColPerRow, idx*numberColPerRow)"
                             :key="item.index">
                        <b-button block
                                  @click="chooseMoney = item.index; money = null; kc = null"
                                  class="label-kc"
                                  v-bind:class="{'label-kc-choose': chooseMoney === item.index}"
                                  variant="outline-primary">
                                                    <span class="text-money"
                                                          style="display: block">{{ item.price | toCurrency }}</span>
                          <span v-if="item.coin > 0"
                                class="text-kc">+ {{ item.coin | toCurrency }}</span>
                          <span v-else class="text-kc">Liên hệ</span>
                        </b-button>
                      </b-col>
                    </b-row>
                    <b-row style="line-height: 38px">
                      <b-col>
                        <b-input-group class="mb-2">
                          <b-input-group-prepend is-text>
                            <b-icon icon="cash-stack"></b-icon>
                          </b-input-group-prepend>
                          <b-form-input v-model="tmp_money" v-on:update="calculator"
                                        type="text"
                                        placeholder="Điền số tiền muốn nạp"></b-form-input>
                        </b-input-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col v-if="money != null && !isNaN(money)"><span
                          class="text-kc" style="font-weight: bolder; margin-left: 3rem">+ {{ kc | toCurrency }}</span></b-col>
                    </b-row>
                    <b-row>
                      <b-col class="text-right">
                        <b-button v-on:click="invoice" variant="success">TIẾP TỤC
                          <b-icon-arrow-bar-right/>
                        </b-button>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-card>
              </b-col>
            </b-row>
            <b-row v-if="payment === true" style="margin-top: 20px">
              <b-col>
                <b-card
                    header="THÔNG TIN CHUYỂN KHOẢN"
                    class="text-left"
                >
                  <b-container>
                    <b-row>
                      <b-col cols="12" sm="6">
                        <b-container>
                          <b-row>
                            <b-col cols="7">Số lượng Xu cần nạp:</b-col>
                            <b-col v-if="kc > 0" class="text-kc">{{ kc | toCurrency }}
                            </b-col>
                            <b-col v-else class="text-kc">Liên hệ</b-col>
                          </b-row>
                          <b-row>
                            <b-col cols="7">Số tiền cần chuyển:</b-col>
                            <b-col class="text-money" style="color: #007bff">
                              {{ money | toCurrency }}
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col cols="7">Nội dung chuyển khoản:</b-col>
                          </b-row>
                          <b-row>
                            <b-col class="text-right" style="font-weight: bolder">MICO [dấu_cách] {{
                                nimoID
                              }} [dấu_cách]
                              {{ kc }}
                            </b-col>
                          </b-row>
                        </b-container>
                      </b-col>
<!--                      <b-col style="border-left: 1px solid rgba(255, 0, 0, .2)">-->
<!--                        Hướng dẫn giao dịch:-->
<!--                        <b-row class="row-step">-->
<!--                          <b-col>-->
<!--                            <b-icon-check-circle style="color: #007bff"/>-->
<!--                            Bước 1: Bấm đăng nhập cho ID cần nạp-->
<!--                          </b-col>-->
<!--                        </b-row>-->
<!--                        <b-row class="row-step">-->
<!--                          <b-col>-->
<!--                            <b-icon-check-circle style="color: #007bff"/>-->
<!--                            Bước 2: Mục combo tuỳ chỉnh: Nhập số KC cần nạp-->
<!--                          </b-col>-->
<!--                        </b-row>-->
<!--                        <b-row class="row-step">-->
<!--                          <b-col>-->
<!--                            <b-icon-check-circle style="color: #007bff"/>-->
<!--                            Bước 3: Bấm tậu-->
<!--                          </b-col>-->
<!--                        </b-row>-->
<!--                        <b-row class="row-step">-->
<!--                          <b-col>-->
<!--                            <b-icon-check-circle style="color: #007bff"/>-->
<!--                            Bước 4: Chọn đại lý "<span-->
<!--                              style="color: #007bff;font-weight: bolder;">FAIRIES</span>"-->
<!--                          </b-col>-->
<!--                        </b-row>-->
<!--                        <b-row class="row-step">-->
<!--                          <b-col style="font-weight: bolder">-->
<!--                            <b-icon-arrow-return-right style="color: #007bff"/>-->
<!--                            CHỤP LẠI MÀN HÌNH-->
<!--                          </b-col>-->
<!--                        </b-row>-->
<!--                      </b-col>-->
                    </b-row>
                    <b-row style="margin-top: 20px">
                      <b-col>
                        <b-button v-on:click="back" variant="primary">
                          <b-icon-arrow-bar-left/>
                          QUAY LẠI
                        </b-button>
                      </b-col>
                      <b-col class="text-right">
                        <b-button target="_blank"
                                  href="https://chat.zalo.me/?phone=0383341246"
                                  variant="success">
                          CHUYỂN BILL QUA INBOX
                          <b-icon-check2-circle/>
                        </b-button>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-card>
              </b-col>
            </b-row>
            <!--Payment method-->
            <b-row style="margin-top: 20px">
              <b-col>
                <b-card
                    header="PHƯƠNG THỨC THANH TOÁN"
                    class="text-left"
                >
                  <b-container>
                    <b-row>
                      <b-col cols="12" sm="6">
                        <b-container>
                          <b-row>
                            <b-col cols="6" sm="3">
                              <b-avatar :src="avatar1"
                                        size="6rem"></b-avatar>
                            </b-col>
                            <b-col>
                              <b-container>
                                <b-row class="row-info">
                                  <b-col>
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="profile"/>
                                    Admin Vũ Duy Linh
                                  </b-col>
                                </b-row>
                                <b-row class="row-info">
                                  <b-col>
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="bank"/>
                                    19034604417018 - Techcombank
                                  </b-col>
                                </b-row>
                                <b-row class="row-info">
                                  <b-col>
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="momo"/>
                                    /
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="zalo"/>
                                    0383341246
                                  </b-col>
                                </b-row>
                                <b-row class="row-info">
                                  <b-col>
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="fb"/>
                                    <b-link href="https://fb.com/lynnbaby123">
                                      https://fb.com/lynnbaby123
                                    </b-link>
                                  </b-col>
                                </b-row>
                              </b-container>
                            </b-col>
                          </b-row>
                        </b-container>
                      </b-col>
                      <b-col cols="12" sm="6">
                        <b-container>
                          <b-row>
                            <b-col cols="6" sm="3">
                              <b-avatar :src="avatar2"
                                        size="6rem"></b-avatar>
                            </b-col>
                            <b-col>
                              <b-container>
                                <b-row class="row-info">
                                  <b-col>
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="profile"/>
                                    Admin Hồ Anh Thư
                                  </b-col>
                                </b-row>
                                <b-row class="row-info">
                                  <b-col>
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="bank"/>
                                    6688199999 - Vietcombank
                                  </b-col>
                                </b-row>
                                <b-row class="row-info">
                                  <b-col>
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="momo"/>
                                    /
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="zalo"/>
                                    0345286628
                                  </b-col>
                                </b-row>
                                <b-row class="row-info">
                                  <b-col>
                                    <b-img
                                        style="display: inline; width: 20px; height: 20px"
                                        :src="fb"/>
                                    <b-link href="https://fb.com/anthu158">
                                      https://fb.com/anthu158
                                    </b-link>
                                  </b-col>
                                </b-row>
                              </b-container>
                            </b-col>
                          </b-row>
                        </b-container>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-card>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
        <!--Menu right-->
        <!--        <b-col></b-col>-->
      </b-row>
    </b-container>
</template>

<script>

import avatar1 from "./assets/avatar1.jpg";
import avatar2 from "./assets/avatar2.jpg";
import bank from "./assets/bank.png";
import carousel1 from "./assets/carousel1.png";
import fb from "./assets/fb.png";
import momo from "./assets/momo.jpeg";
import profile from "./assets/profile.png";
import zalo from "./assets/zalo.png";
import sr from "./assets/sr.gif";

export default {
  name: 'App',
  kc: null,
  data() {
    return {
      avatar1: avatar1,
      avatar2: avatar2,
      bank: bank,
      carousel1: carousel1,
      fb: fb,
      momo: momo,
      profile: profile,
      zalo: zalo,
      sr: sr,
      isHoverDashboard: false,
      isHoverRegister: false,
      nimoID: null,
      chooseMoney: null,
      numberColPerRow: 6,
      listPrice: [
        {index: 1, price: 100000, coin: 525},
        {index: 2, price: 200000, coin: 1050},
        {index: 3, price: 300000, coin: 1600},
        {index: 4, price: 500000, coin: 2700},
        {index: 5, price: 1000000, coin: 5400},
        {index: 6, price: 2000000, coin: 10800},
        {index: 7, price: 3000000, coin: 16200},
        {index: 8, price: 5000000, coin: 27300},
        {index: 9, price: 10000000, coin: 54640},
        {index: 10, price: 15000000, coin: 81950},
        {index: 11, price: 20000000, coin: 109200},
        {index: 12, price: 50000000, coin: 273200},
        {index: 13, price: 100000000, coin: 546400},
      ],
      tmp_money: null,
      money: null,
      kc: null,
      payment: false,
      isOutOfStock: false
    }
  },
  created() {
    // axios.post("/config/get_config?config_key=out_of_stock").then(rs => {
    //   this.isOutOfStock = (rs.data.data[0].value === 'true');
    // })
  },
  methods: {
    calculator() {
      this.kc = null
      this.money = null
      if (this.tmp_money !== null && this.tmp_money.trim() !== '' && !isNaN(this.tmp_money)) {
        this.money = parseInt(this.tmp_money);
        this.chooseMoney = null
        if (this.money <= 200000) {
          this.kc = Math.ceil(this.money / 190)
        } else if (this.money <= 999999) {
          this.kc = Math.ceil(this.money / 187)
        } else if (this.money <= 4999999) {
          this.kc = Math.ceil(this.money / 185)
        } else {
          this.kc = Math.ceil(this.money / 183)
        }
      }
    },
    // currentDate() {
    //   const current = new Date();
    //   return `${current.getHours() < 9 ? '0' + current.getHours() : current.getHours()}:${current.getMinutes() < 9 ? '0' + current.getMinutes() : current.getMinutes()}:${current.getSeconds() < 9 ? '0' + current.getSeconds() : current.getSeconds()} ${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
    // },
    invoice() {
      if (this.nimoID === null || this.nimoID.trim() === '') {
        window.alert("Chưa nhập ID")
        return;
      }
      if (this.money === null || this.kc === null) {
        if (this.chooseMoney === null) {
          window.alert("Chưa chọn mệnh giá XU")
          return;
        }
        this.money = this.listPrice[this.chooseMoney - 1].price;
        this.kc = this.listPrice[this.chooseMoney - 1].coin;
      }
      this.payment = true;
    },
    back() {
      this.tmp_money = null
      this.money = null
      this.kc = null
      this.payment = false;
    },
    hoverDashboard(hovered) {
      this.isHoverDashboard = hovered;
    },
    hoverRegister(hovered) {
      this.isHoverRegister = hovered;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Source Sans Pro', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #E1F5FE;
}

.text-kc {
  color: goldenrod;
}

.text-money {
  font-weight: bolder;
}

.label-kc {
  cursor: pointer;
}

.label-kc:hover, .label-kc-choose {
  background-color: #cce5ff;
  color: #007bff;
  border-color: #007bff;
}

.giuseart-nav {
  position: fixed;
  right: 10px;
  background: #fff;
  border-radius: 5px;
  width: auto;
  z-index: 150;
  bottom: 50px;
  padding: 10px 0;
  border: 1px solid #f2f2f2;
}

.row-info {
  margin-bottom: 13px;
}

.row-step {
  padding-left: 20px;
  margin-bottom: 10px;
  margin-top: 5px;
}
</style>
