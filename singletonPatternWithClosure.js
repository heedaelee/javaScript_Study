let singleton = (function() {
  let instance;
  function init() {
    // private methods and variables
    function privateMethod(){
        console.log( "I am private" );
    }
    let privateVariable = "I'm also private";
    let privateRandomNumber = Math.random();
    return {
      // public methods and variables
      publicMethod: function() {
        console.log( "The public can see me!" );
      },
      publicProperty: "I am also public",
      getRandomNumber: function() {
        return privateRandomNumber;
      }
    };
  };
  return {
    getInstance: function() {
      if ( !instance ) {
        // init() return 값은 
        // {key:value} 객체 형태로 함수랑 변수가 들어간거임
        instance = init();
      }
      return instance;
    }
  };
})();
//즉시 실행 함수();

/**
 * signleton.getInstance()를 계속 호출해도,
 * instance 변수의 자원은 계속 공유하게 됨.
 * getInstance () 함수가 클로저 함수이고, 클로저 함수의 특성에 따라
 * 외부함수(부모함수) 의 자원 instance를 singleton()의 생명주기가 끝났음에도 
 * 계속 공유 할수 있게됨. 
 * 또한 이 instance 변수는 외부에서 함부로 접근이 불가능하므로(singleton 함수 생명주기가 끝났으니)
 * 오직 getInstance()호출로만 접근이 가능하므로 객체의 은닉화(java의 private)역할을 가능케 함
 */
let singletonA = singleton.getInstance();
let singletonB = singleton.getInstance();
console.log( singletonA.getRandomNumber() === singletonB.getRandomNumber() ); // true