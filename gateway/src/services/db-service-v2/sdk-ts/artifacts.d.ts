export declare const artifacts: {
    Address: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            organizationAddressList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            organizationList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
        };
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    CSP: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            cspCapabilityList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    CSPCapability: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            csp: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {
            cspUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            cspUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    CSPCapabilityCryptocmd: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            cspCapabilityCryptocmdAlgorcmd: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {
            algorcmdUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            algorcmdUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    CSPCapabilityCryptocmdAlgorcmd: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            cspCapabilityCryptocmdList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    CertificateAuthority: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            pki: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateAuthorityCertificateTokenList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateTokenList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
        };
        relationUuidFields: {
            pkiUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            pkiUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    CertificateAuthorityCertificateToken: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            certificateAuthority: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateToken: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {
            certificateAuthorityUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateTokenUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            certificateAuthorityUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateTokenUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    CertificateToken: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            certificateAuthority: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateAuthorityCertificateTokenList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            organizationCertificateTokenList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateAuthorityList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
            organizationList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
        };
        relationUuidFields: {
            issuerCertificateAuthorityUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            issuerCertificateAuthorityUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    CertificateTokenState: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {};
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    Comment: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {};
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    Job: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {};
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    JobState: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {};
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    Order: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {};
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    OrderState: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {};
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    Organization: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            organizationAddressList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            organizationCertificateTokenList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            userOrganizationList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            addressList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
            certificateTokenList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
            userList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
        };
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    OrganizationAddress: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            address: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            organization: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {
            addressUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            organizationUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            addressUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            organizationUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    OrganizationCertificateToken: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            organization: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateToken: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {
            organizationUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateTokenUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            organizationUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            certificateTokenUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    PKI: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            certificateAuthorityList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    Role: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            userList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
            userRoleList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    StateType: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {};
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    User: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            role: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            userOrganizationList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            userRoleList: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            organizationList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
            roleList: {
                type: string;
                table: string;
                junctionTable: string;
                grabMany: boolean;
                fromRelations: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                }[];
            };
        };
        relationUuidFields: {
            primaryRoleUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            primaryRoleUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    UserOrganization: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            organization: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            user: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {
            organizationUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            userUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            organizationUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            userUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    UserRole: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {
            role: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            user: {
                type: string;
                table: string;
                grabMany: boolean;
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        relationUuidFields: {
            roleUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            userUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        inputDataRelationUuidFields: {
            roleUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
            userUuid: {
                relation: {
                    localTable: string;
                    localField: string;
                    localForeignIdent: string;
                    foreignTable: string;
                    foreignField: string;
                    foreignIdent: string;
                };
            };
        };
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
    _Base: {
        table: string;
        scalarFields: string[];
        nonScalarFields: {};
        relationUuidFields: {};
        inputDataRelationUuidFields: {};
        dateTimeFields: {
            created: boolean;
            updated: boolean;
        };
        dateTimeFieldsCount: number;
    };
};
