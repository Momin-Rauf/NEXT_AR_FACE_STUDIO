import 'next-auth'


// Extend JSX to support A-Frame elements
declare namespace JSX {
    interface IntrinsicElements {
      'a-camera': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'a-asset-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'a-gltf-model': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
  

declare module 'next-auth' {
    interface User{ 
        _id?:string;
        isVerified?:boolean
        username?:string

    }

    interface Session{
        user:{
            _id?:string;
            isVerified?:boolean;
            username?:string;
        } & DefaultSession['user']
    }

    interface JWT{
        _id?:string;
            isVerified?:boolean;
            username?:string;
    }

    
}