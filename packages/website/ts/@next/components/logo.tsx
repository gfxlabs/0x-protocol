import * as React from 'react';
import styled from 'styled-components';

import logoWithType from '../icons/logo-with-type.svg';

interface LogoInterface {
    // showType: boolean;
}

const StyledLogo = styled.div`
    text-align: left;
`;

const Icon = styled.div`
    flex-shrink: 0;
`;

export const Logo: React.StatelessComponent<LogoInterface> = ({}) => (
    <StyledLogo>
        <Icon as={logoWithType as 'svg'} />
    </StyledLogo>
);
