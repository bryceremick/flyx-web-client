<template>
  <div class="autocomplete" v-bind:id="this.id">
    <input type="text" v-model="query" @input="isOpen=true" @blur="closeSuggestions" @keyup.prevent="send()" v-bind:placeholder="this.placeholder">
    <ul class="autocomplete-results" v-show="isOpen">
      <li class="autocomplete-result" v-for="(result, i) in results.slice(0,show)" :key="i" @click="setResult(result)">
         <p> {{ result }} </p>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
import { autocomplete } from "@/services/Api";

export default {
  props: {
    show: {
      type: Number,
      required: false,
      default: () => 7
    },
    value: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        required: false,
        default: () => ''
    }
  },
  data() {
    return {
      query: '',
      results: [],
      isOpen: false
    };
  },
  methods: {
    send: async function() {

      const response = await autocomplete(this.query);
      this.results = response.data.data.map(a => a._source.Combined);

      // Api()
      //   .get("/autocomplete?q=" + this.query)
      //   .then(response => {
      //     this.results = response.data.data.map(a => a._source.Combined);
      //   });
    },
    closeSuggestions: function () {
        var $this = this;
        this.counter({
            close() { $this.isOpen = false; }
            });
    },
    counter: function (x) {
        setTimeout(()=>{
            x.close();
        },150)
    },
    setResult: function (result) {
        this.query = result;
        this.isOpen = false;

        this.returnResult();
    },
    returnResult: function (event) {
        this.$emit("input", this.query) ;
    }
  }
};
</script>

<style lang="scss">
.autocomplete-results {
  position: absolute;
  width: 400px;
  max-width: 400px;
  margin-top: 5px;
  overflow-x: hidden;
  background-color: #fff;
  border-radius: 10px;
  z-index: 499;
}

.autocomplete-result {
  overflow-y: hidden;
  // height: 35px;
  width: 100%;
  z-index: 500;
  cursor: pointer;

  p{
    margin: 5px;
  }
}

.autocomplete-result:hover {
  background-color: #22B4DE;
  color: white;
}
</style>