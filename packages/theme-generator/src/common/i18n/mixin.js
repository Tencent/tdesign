import enText from "./en-US";
import cnText from "./zh-CN";

const langMixin = {
  data() {
    return {
      lang: null,
      isEn: false,
    };
  },
  created() {
    const isEn = window.location.pathname.endsWith("en");
    this.lang = isEn ? enText : cnText;
    this.isEn = isEn
  },
};

export default langMixin;
