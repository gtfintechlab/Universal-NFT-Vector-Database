<template>
  <div class="parentTable">
    <h2 class="title" v-if="!isLoading">{{ config.title.toUpperCase() }}</h2>
    <table class="table" v-if="!isLoading">
        <thead>
            <tr>
                <th v-for="(header, index) in config.headers" :key="index" class="headerStyle">{{ header }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, id) in config.data" :key="id" class="trStyle">
                <td v-for="(header, indexHeader) in config.headers" :key="indexHeader" class="rowStyle">
                    <div class="dataStyle">
                        {{row[header]}}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <PulseLoader v-if="isLoading" color="#16324C" class="vue-spinner" />
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
    name: 'Table',
    components: { PulseLoader },
    props: {
        config: {
            type: null,
            default: {},
            required: false
        },
        isLoading: {
            type: Boolean,
            default: false,
            required: false
        }
    } 
}
</script>

<style scoped>
    .parentTable{
        background-color: white;
        padding: 20px 20px 10px 20px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: baseline;
        text-align: left;
    }
    .parentTable .title {
        font-family: 'Outfit';
        color: #000000;
        opacity: 50%;
        font-size: 1.0rem;
        font-weight: 500;
        margin-top: 5px;
        margin-bottom: 10px;
        padding-bottom: 20px;        
    }

    .parentTable .headerStyle{
        font-family: 'Inter';
        color: #000000;
        opacity: 50%;
        font-size: 1.0rem;
        font-weight: 500;
        margin-top: 5px;
        margin-bottom: 23px;
        padding-bottom: 20px;
    }   
    .parentTable .rowStyle{
        font-family: "Inter";
        font-weight: 600;
        font-size: 0.9rem;
        padding: 20px;
        padding-left: 0px;
    }
    .parentTable table {
        border-collapse: collapse;
    }
    .parentTable .trStyle {
        border-top: 2px solid #E6E6E6;
    }

    .vue-spinner{
        align-self: center;
        justify-self: center;
    }
</style>


