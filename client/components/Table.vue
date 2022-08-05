<template>
  <div class="parentTable">
    <h2 class="title">{{ config.title.toUpperCase() }}</h2>
    <table class="table">
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
  </div>
</template>

<script>
export default {
    name: 'Table',
    props: {
        config: {
            type: null,
            default: {},
            required: false
        }
    } 
}
</script>

<style scoped>
    .parentTable{
        margin: 25px 25px 25px 25px;
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
</style>


