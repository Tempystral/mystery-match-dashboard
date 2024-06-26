import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, fa } from "vuetify/iconsets/fa-svg";
import "vuetify/styles";

import { VueQueryPlugin, VueQueryPluginOptions } from "@tanstack/vue-query";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { enUS } from "date-fns/locale/en-US";
import DateFnsUtils from "@date-io/date-fns";

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
library.add(fab);
library.add(fas);
library.add(far);

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
  },
  icons: {
    defaultSet: "fa",
    aliases,
    sets: {
      fa,
    },
  },
  date: {
    adapter: new DateFnsUtils({ locale: enUS }),
    locale: enUS,
  },
});

const queryOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
};

app.use(vuetify).use(router).use(VueQueryPlugin).mount("#app");
