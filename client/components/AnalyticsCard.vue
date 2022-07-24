<template>
    <div class="card-container">
        <h1 class="title-text">{{title}}</h1>
        <h2 class="statistic-text">{{statistic}}</h2>
        <h3 class="subtitle-text">{{subtitle}}</h3>
    </div>
</template>

<script>
export default{
    name: 'AnalyticsCard',
    props: {
        title: {
            type: String,
            default: "Total NFTs in Vector Database",
            required: false
        },
        statistic: {
            type: String,
            default: "500,230",
            required: false
        },
        subtitle: {
            type: String,
            default: "432,000 in Task Queue",
            required: false
        },
        width: {
            type: String,
            default: "40%",
            required: false
        }
    }
}
</script>


<style scoped>
h1, h2, h3{
    margin: 0;
}
.card-container{
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    /* width: v-bind('width') */
}

.title-text{
    font-family: 'Outfit';
    color: #000000;
    opacity: 50%;
    font-size: 1.4rem;
    font-weight: lighter;
    margin-bottom: 30px;
}

.statistic-text{
    font-family: "Inter";
    font-weight: 900;
    font-size: 2rem;
    margin-bottom: 17px;
}
.subtitle-text{
    font-family: "Inter";
    font-weight: 400;
    font-size: 1rem;
}
</style>