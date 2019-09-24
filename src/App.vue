<template>
    <div id="app">
        <div class="img-header-container">
            <img src="./assets/Logo.svg" class="img-header" alt=""/>
        </div>
        <div id="nav">
            <router-link to="/concept">Concept</router-link>&nbsp;
            <router-link to="/">Auction</router-link>&nbsp;
            <router-link to="/about">About</router-link>
        </div>
        <router-view auctionContractName="TwistedAuctionMock" />
    </div>
</template>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap';

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: rgb(33, 37, 41);
    }

    /*todo: import media queries for max width*/
    #nav {
        margin: 3rem auto;
        width: 100%;
        padding: 0 15px;
        font-size: 1.75rem;
        text-align: center;

        a {
            font-weight: bold;
            color: rgb(33, 37, 41);
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }
    }

    .img-header-container {
        padding: 0 1rem;
        margin: 1rem 0;
    }

    .img-header {
        width: 100%;
    }
</style>
